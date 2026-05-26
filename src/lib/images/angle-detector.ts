export type Angle = 'front' | 'back' | 'detail' | 'lifestyle' | 'unknown'

const PATTERNS: Array<{ angle: Angle; regex: RegExp }> = [
  { angle: 'front',     regex: /(_|^)(LEFT|FRONT|SIDE)(_|\.)/i },
  { angle: 'back',      regex: /(_|^)BACK(_|\.)/i },
  { angle: 'detail',    regex: /(_|^)(DETAIL|CLOSEUP|MACRO)(_|\.)/i },
  { angle: 'lifestyle', regex: /(_|^)(LIFESTYLE|WORN|MODEL)(_|\.)/i },
]

export function detectAngle(filenameOrUrl: string): Angle {
  // Extraire juste le filename si URL (drop query string + path)
  const name = filenameOrUrl.split('/').pop()?.split('?')[0] ?? filenameOrUrl
  for (const { angle, regex } of PATTERNS) {
    if (regex.test(name)) return angle
  }
  return 'unknown'
}
