import type { V3PageData } from '@/types/v3'
import type { StyleTokens } from '@/lib/styles/types'
import { escapeHtml, escapeAttr } from '@/lib/utils/html'

export function renderGallery(data: V3PageData, tokens: StyleTokens): string {
  if (data.images.length === 0) {
    return `<section class="v3-gallery" style="background:${tokens.colors.bg};padding:${tokens.spacing.section} 0;"></section>`
  }

  const totalCount = data.images.length
  const short = tokens.motion.durationShort ?? '120ms'

  const slides = data.images
    .map(
      (src, i) => `
    <div class="v3-gallery__slide" data-idx="${i}" style="
      flex:0 0 auto;width:min(420px,70vw);
      border-radius:${tokens.radius.image};
      overflow:hidden;
      scroll-snap-align:start;
      box-shadow:${tokens.shadows.card};
      position:relative;
    ">
      <img
        src="${escapeAttr(src)}"
        alt="${escapeHtml(data.product.title)} - vue ${i + 1}"
        style="width:100%;height:auto;display:block"
        loading="lazy"
      >
      ${i === 0 ? `<div id="kvt-gallery-counter" style="
        position:absolute;bottom:10px;right:10px;
        background:rgba(0,0,0,0.45);color:#fff;
        font-size:12px;font-weight:600;
        padding:4px 10px;border-radius:4px;
        backdrop-filter:blur(4px);
        pointer-events:none;
        font-family:${tokens.fonts.body};
      ">1 / ${totalCount}</div>` : ''}
    </div>`,
    )
    .join('')

  // Dot pagination — 1 dot par image, highlight du 1er (CSS only pour état initial)
  const dots = data.images.map((_, i) =>
    `<span class="v3-gallery__dot" data-idx="${i}" style="
      display:inline-block;
      width:6px;height:6px;border-radius:50%;
      background:${tokens.colors.text};
      opacity:${i === 0 ? '1' : '0.25'};
      transition:opacity ${short} ${tokens.motion.ease};
      cursor:pointer;
    "></span>`
  ).join('')

  // JS inline : IntersectionObserver sur les slides pour mettre à jour counter + dots au scroll.
  // Cohérent avec le pattern hero T1 — même look, même logique.
  const galleryScript = `<script>
(function(){
  var track=document.querySelector('.v3-gallery__track');
  var slides=document.querySelectorAll('.v3-gallery__slide');
  var dots=document.querySelectorAll('.v3-gallery__dot');
  var counter=document.getElementById('kvt-gallery-counter');
  var total=${totalCount};
  if(!track||!slides.length)return;
  function setActive(idx){
    dots.forEach(function(d,i){d.style.opacity=i===idx?'1':'0.25';});
    if(counter)counter.textContent=(idx+1)+' / '+total;
  }
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var idx=parseInt(e.target.getAttribute('data-idx')||'0',10);
        setActive(idx);
      }
    });
  },{root:track,threshold:0.5});
  slides.forEach(function(s){io.observe(s);});
  dots.forEach(function(d,i){
    d.addEventListener('click',function(){
      var target=slides[i];
      if(target)target.scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});
    });
  });
}());
<\/script>`

  return `
<section class="v3-gallery" style="
  background:${tokens.colors.bg};
  padding:${tokens.spacing.section} 0;
  font-family:${tokens.fonts.body};
">
  <div style="max-width:1240px;margin:0 auto;padding:0 24px 32px">
    <h2 style="
      font-family:${tokens.fonts.heading};
      color:${tokens.colors.text};
      font-size:clamp(28px,3vw,40px);
      font-weight:400;
      margin:0;
    ">Tous les angles</h2>
  </div>
  <div class="v3-gallery__track" style="
    display:flex;
    gap:${tokens.spacing.gap};
    overflow-x:auto;
    scroll-snap-type:x mandatory;
    padding:0 24px 24px;
    scrollbar-width:none;
    -ms-overflow-style:none;
    touch-action:pan-x;
  ">
    ${slides}
  </div>
  <div class="v3-gallery__dots" style="
    display:flex;gap:6px;justify-content:center;margin-top:16px;
  ">
    ${dots}
  </div>
  ${galleryScript}
</section>`.trim()
}

