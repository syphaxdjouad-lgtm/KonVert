// ─── ICÔNES SVG POLARIS STYLE ────────────────────────────────────────────────
// Inspiration Shopify Polaris · Material Design · fill="currentColor" pour hériter la couleur CSS

const svg = (path: string, size: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" style="display:block;flex-shrink:0;"><path d="${path}"/></svg>`

const P = {
  truck:   'M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.22-3c-.55-.61-1.36-1-2.22-1s-1.67.39-2.22 1H3V6h12v7H8.22zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-4V9h2.31l2.28 3H17z',
  lock:    'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
  return:  'M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z',
  flash:   'M7 2v11h3v9l7-12h-4l4-8z',
  leaf:    'M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 4-8 4s-.78-3.47-3.11-5.11L7 5.07C7.95 6.62 9 8 9 8H7v2h10V8h-2z',
  flask:   'M9 2v8L5 20h14L15 10V2H9zm4 0v2h-2V2h2zm2 9.88L16.63 18H7.37L9 11.88V10h6v1.88z',
  recycle: 'M6.05 8.5L4 12h3v8h10v-8h3l-2.05-3.5H6.05zM12 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM12 1l-2 4h4l-2-4zm-4.5 3l-1 4 3.5-2-2.5-2zm9 0l-2.5 2 3.5 2-1-4z',
  trophy:  'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zm-2 3c0 1.65-1.35 3-3 3S11 9.65 11 8V5h6v3zM5 8V7h2v1c0 .64.1 1.26.27 1.85C6.01 9.3 5 8.76 5 8zm14 0c0 .76-1.01 1.3-2.27 1.85.17-.59.27-1.21.27-1.85V7h2v1z',
  star:    'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  shield:  'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z',
}

export const ico = {
  truck:   (size = 20) => svg(P.truck,   size),
  lock:    (size = 20) => svg(P.lock,    size),
  return:  (size = 20) => svg(P.return,  size),
  flash:   (size = 20) => svg(P.flash,   size),
  leaf:    (size = 20) => svg(P.leaf,    size),
  flask:   (size = 20) => svg(P.flask,   size),
  recycle: (size = 20) => svg(P.recycle, size),
  trophy:  (size = 20) => svg(P.trophy,  size),
  star:    (size = 20) => svg(P.star,    size),
  shield:  (size = 20) => svg(P.shield,  size),
}
