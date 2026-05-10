// Smoke test ad hoc des sanitizers — à supprimer après validation.
// Exécution : npx tsx scripts/test-sanitize.ts
import { escapeHtmlText, safeImageUrl, sanitizeDeep } from '../src/lib/security/sanitize'
import { cleanProduct } from '../src/lib/scraper'
import type { ScrapedProduct } from '../src/types'

let pass = 0
let fail = 0

function assert(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (ok) {
    pass++
    console.log(`  PASS  ${name}`)
  } else {
    fail++
    console.log(`  FAIL  ${name}`)
    console.log(`        expected: ${JSON.stringify(expected)}`)
    console.log(`        actual:   ${JSON.stringify(actual)}`)
  }
}

console.log('\n--- escapeHtmlText ---')
assert('escape <script>', escapeHtmlText('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;')
assert('escape attribute breakout', escapeHtmlText('" onerror="x'), '&quot; onerror=&quot;x')
assert('escape single quote', escapeHtmlText("hello' world"), 'hello&#39; world')
assert('keep ampersand', escapeHtmlText('Marshall & sons'), 'Marshall & sons')
assert('null returns empty', escapeHtmlText(null), '')
assert('undefined returns empty', escapeHtmlText(undefined), '')
assert('plain text untouched', escapeHtmlText('Hello world 100€'), 'Hello world 100€')

console.log('\n--- safeImageUrl ---')
assert('valid https', safeImageUrl('https://cdn.shopify.com/img.jpg'), 'https://cdn.shopify.com/img.jpg')
assert('valid http', safeImageUrl('http://example.com/img.png'), 'http://example.com/img.png')
assert('reject javascript:', safeImageUrl('javascript:alert(1)'), null)
assert('reject data:', safeImageUrl('data:image/png;base64,abc'), null)
assert('reject file:', safeImageUrl('file:///etc/passwd'), null)
assert('reject quote in url', safeImageUrl('https://x.com/a"onerror=x'), null)
assert('reject space in url', safeImageUrl('https://x.com/a b.jpg'), null)
assert('reject empty', safeImageUrl(''), null)
assert('reject non-string', safeImageUrl(123), null)
assert('reject malformed', safeImageUrl('not-a-url'), null)

console.log('\n--- sanitizeDeep ---')
assert('escape string in object', sanitizeDeep({ a: '<x>' }), { a: '&lt;x&gt;' })
assert('escape strings in array', sanitizeDeep(['<a>', '<b>']), ['&lt;a&gt;', '&lt;b&gt;'])
assert('nested deeply', sanitizeDeep({ a: { b: ['<c>'] } }), { a: { b: ['&lt;c&gt;'] } })
assert('preserve numbers', sanitizeDeep({ n: 42 }), { n: 42 })
assert('preserve booleans', sanitizeDeep({ b: true }), { b: true })
assert('preserve null', sanitizeDeep({ x: null }), { x: null })

console.log('\n--- cleanProduct (defense-in-depth) ---')
const evil: ScrapedProduct = {
  title: '<script>alert(1)</script>Stylo Pilot',
  description: '" onerror="alert(1) Voici un super stylo',
  images: ['javascript:alert(1)', 'https://cdn.com/img.jpg', 'data:text/html,abc'],
  price: '12.50',
  original_price: '20',
  variants: [],
  rating: null,
  reviews_count: null,
  source_url: 'https://aliexpress.com/x',
}
const cleaned = cleanProduct(evil)
assert(
  'cleanProduct escapes title',
  cleaned.title,
  '&lt;script&gt;alert(1)&lt;/script&gt;Stylo Pilot'
)
assert(
  'cleanProduct escapes description',
  cleaned.description,
  '&quot; onerror=&quot;alert(1) Voici un super stylo'
)
assert(
  'cleanProduct drops javascript: and data: image URLs',
  cleaned.images,
  ['https://cdn.com/img.jpg']
)

console.log(`\n--- Résultat : ${pass} pass, ${fail} fail ---`)
process.exit(fail === 0 ? 0 : 1)
