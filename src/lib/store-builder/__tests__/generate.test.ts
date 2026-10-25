import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ScrapedProduct } from '@/types'

// Mock partiel du module 'ai' : on garde la vraie classe NoObjectGeneratedError
// (utilisée par generate.ts pour discriminer les erreurs récupérables) mais on
// remplace `generateObject` par un mock contrôlable par test — aucun réseau,
// aucune clé DeepSeek réelle nécessaire.
const generateObjectMock = vi.fn()
vi.mock('ai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('ai')>()
  return {
    ...actual,
    generateObject: (...args: unknown[]) => generateObjectMock(...args),
  }
})

// createDeepSeek n'a besoin de rien de plus qu'une factory qui renvoie une
// fonction "model" bidon — generateObject étant mocké, le modèle réel n'est
// jamais appelé.
vi.mock('@ai-sdk/deepseek', () => ({
  createDeepSeek: () => (_modelId: string) => ({ modelId: _modelId }),
}))

const { generateStoreBuilderContent } = await import('../generate')
const { NoObjectGeneratedError } = await import('ai')
const { DEFAULT_TEMPLATE_CONTENT } = await import('../default-content')

const SAMPLE_PRODUCT: ScrapedProduct = {
  title: 'Écouteurs sans fil Bluetooth',
  description: 'Écouteurs intra-auriculaires, autonomie 20h, étanches IPX5.',
  images: [],
  price: '29.99',
  original_price: null,
  variants: [],
  rating: 4.5,
  reviews_count: 1200,
  source_url: 'https://www.aliexpress.com/item/123.html',
}

function makeNoObjectGeneratedError() {
  return new NoObjectGeneratedError({
    message: 'schema mismatch',
    response: { id: 'r1', timestamp: new Date(), modelId: 'deepseek-chat' },
    usage: { inputTokens: 10, outputTokens: 0, totalTokens: 10, inputTokenDetails: {}, outputTokenDetails: {} } as never,
    finishReason: 'error',
  })
}

describe('generateStoreBuilderContent', () => {
  const originalKey = process.env.DEEPSEEK_API_KEY

  beforeEach(() => {
    generateObjectMock.mockReset()
    process.env.DEEPSEEK_API_KEY = 'test-key'
  })

  afterEach(() => {
    process.env.DEEPSEEK_API_KEY = originalKey
  })

  it('lève une erreur explicite si DEEPSEEK_API_KEY est absente', async () => {
    delete process.env.DEEPSEEK_API_KEY
    await expect(generateStoreBuilderContent(SAMPLE_PRODUCT, 'tech')).rejects.toThrow(/DEEPSEEK_API_KEY/)
    expect(generateObjectMock).not.toHaveBeenCalled()
  })

  it('retourne la sortie validée directement en cas de succès (pas de fallback)', async () => {
    const validOutput = DEFAULT_TEMPLATE_CONTENT.tech
    generateObjectMock.mockResolvedValueOnce({
      object: validOutput,
      usage: { inputTokens: 500, outputTokens: 1200 },
    })

    const result = await generateStoreBuilderContent(SAMPLE_PRODUCT, 'tech')

    expect(result.usedFallback).toBe(false)
    expect(result.output).toBe(validOutput)
    expect(result.usage).toEqual({ promptTokens: 500, completionTokens: 1200 })
    expect(generateObjectMock).toHaveBeenCalledTimes(1)
  })

  it('appelle generateObject avec le system prompt statique du vertical + le prompt dynamique du produit', async () => {
    generateObjectMock.mockResolvedValueOnce({
      object: DEFAULT_TEMPLATE_CONTENT.beaute,
      usage: { inputTokens: 1, outputTokens: 1 },
    })

    await generateStoreBuilderContent(SAMPLE_PRODUCT, 'beaute')

    const call = generateObjectMock.mock.calls[0][0] as {
      system: string
      prompt: string
      maxRetries: number
    }
    expect(call.system).toContain('VERTICAL BEAUTÉ')
    expect(call.prompt).toContain(SAMPLE_PRODUCT.title)
    expect(call.maxRetries).toBe(2)
  })

  it('retente une fois puis bascule sur le fallback figé si generateObject échoue systématiquement (NoObjectGeneratedError)', async () => {
    generateObjectMock.mockRejectedValue(makeNoObjectGeneratedError())

    const result = await generateStoreBuilderContent(SAMPLE_PRODUCT, 'dropshipping')

    expect(result.usedFallback).toBe(true)
    expect(result.output).toBe(DEFAULT_TEMPLATE_CONTENT.dropshipping)
    expect(generateObjectMock).toHaveBeenCalledTimes(2) // 1 tentative + 1 retry structurel
  })

  it('récupère après 1 échec puis un succès (retry structurel fonctionnel)', async () => {
    generateObjectMock
      .mockRejectedValueOnce(makeNoObjectGeneratedError())
      .mockResolvedValueOnce({ object: DEFAULT_TEMPLATE_CONTENT.tech, usage: { inputTokens: 1, outputTokens: 1 } })

    const result = await generateStoreBuilderContent(SAMPLE_PRODUCT, 'tech')

    expect(result.usedFallback).toBe(false)
    expect(result.output).toBe(DEFAULT_TEMPLATE_CONTENT.tech)
    expect(generateObjectMock).toHaveBeenCalledTimes(2)
  })

  it('rejette (via le filet R5) une sortie qui contiendrait malgré tout un champ interdit, puis retombe sur le fallback', async () => {
    // Simule un contournement hypothétique du schéma Zod (défense en
    // profondeur — ne devrait jamais arriver en pratique, cf. schema.ts).
    const polluted = {
      ...DEFAULT_TEMPLATE_CONTENT.dropshipping,
      founder_story: { ...DEFAULT_TEMPLATE_CONTENT.dropshipping.founder_story, founder_name: 'Jean Dupont' },
    }
    generateObjectMock.mockResolvedValue({ object: polluted, usage: { inputTokens: 1, outputTokens: 1 } })

    const result = await generateStoreBuilderContent(SAMPLE_PRODUCT, 'dropshipping')

    expect(result.usedFallback).toBe(true)
    expect(result.output).toBe(DEFAULT_TEMPLATE_CONTENT.dropshipping)
    expect(generateObjectMock).toHaveBeenCalledTimes(2)
  })

  it('propage une erreur non récupérable (ex. erreur réseau générique) sans retry ni fallback silencieux', async () => {
    generateObjectMock.mockRejectedValue(new Error('ECONNRESET'))

    await expect(generateStoreBuilderContent(SAMPLE_PRODUCT, 'dropshipping')).rejects.toThrow('ECONNRESET')
    expect(generateObjectMock).toHaveBeenCalledTimes(1)
  })

  it('transmet merchant_facts au prompt utilisateur quand fourni', async () => {
    generateObjectMock.mockResolvedValueOnce({
      object: DEFAULT_TEMPLATE_CONTENT.dropshipping,
      usage: { inputTokens: 1, outputTokens: 1 },
    })

    await generateStoreBuilderContent(SAMPLE_PRODUCT, 'dropshipping', { warranty_duration: '2 ans' })

    const call = generateObjectMock.mock.calls[0][0] as { prompt: string }
    expect(call.prompt).toContain('2 ans')
  })
})
