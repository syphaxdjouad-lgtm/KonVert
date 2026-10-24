import { describe, it, expect } from 'vitest'
import { detectLangDrift } from './lang-drift'

describe('detectLangDrift', () => {
  it('arabe correct sur cible ar → pas de drift', () => {
    expect(detectLangDrift('صورة تنبض بالحياة في كل غرفة', 'ar')).toBe(false)
  })

  it('français sur cible ar → drift détecté', () => {
    expect(detectLangDrift('Une image qui prend vie dans chaque pièce', 'ar')).toBe(true)
  })

  it('chinois correct sur cible zh → pas de drift', () => {
    expect(detectLangDrift('一张让每个房间都充满活力的图片', 'zh')).toBe(false)
  })

  it('français sur cible zh → drift détecté', () => {
    expect(detectLangDrift('Une image qui prend vie dans chaque pièce', 'zh')).toBe(true)
  })

  it('texte vide → pas de drift (rien à évaluer)', () => {
    expect(detectLangDrift('', 'ar')).toBe(false)
    expect(detectLangDrift('   ', 'ar')).toBe(false)
  })

  it('cible fr → jamais de drift signalé (pas de vérif dispo)', () => {
    expect(detectLangDrift('Une image qui prend vie dans chaque pièce', 'fr')).toBe(false)
    expect(detectLangDrift('An image that comes alive in every room', 'fr')).toBe(false)
  })

  it('langue non reconnue → jamais de drift signalé (dégrade proprement)', () => {
    expect(detectLangDrift('Une image qui prend vie dans chaque pièce', 'xx')).toBe(false)
  })

  it('cible latine non-FR (en) : texte anglais correct → pas de drift', () => {
    expect(detectLangDrift('A picture that comes alive in every room, day after day', 'en')).toBe(false)
  })

  it('cible latine non-FR (en) : texte français avec forte densité de stopwords FR → drift détecté', () => {
    expect(detectLangDrift('Le produit que vous cherchez pour la maison avec des résultats pour tous', 'en')).toBe(true)
  })

  it('cible latine non-FR (en) : texte trop court → pas de drift (signal insuffisant)', () => {
    expect(detectLangDrift('Le TV', 'en')).toBe(false)
  })

  it('mélange majoritairement arabe avec quelques mots latins (marque) → pas de drift', () => {
    expect(detectLangDrift('تلفزيون Xiaomi الذكي بدقة 4K عالية الجودة', 'ar')).toBe(false)
  })
})
