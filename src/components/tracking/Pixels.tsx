// Wrapper qui mount les 3 pixels d'un coup. Inclus dans le root layout.
// Chacun se gère lui-même (no-op si env absent, attente du consent).
import MetaPixel from './MetaPixel'
import GoogleTag from './GoogleTag'
import TikTokPixel from './TikTokPixel'

export default function Pixels() {
  return (
    <>
      <MetaPixel />
      <GoogleTag />
      <TikTokPixel />
    </>
  )
}
