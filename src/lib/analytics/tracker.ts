// Script de tracking minifié injecté dans chaque page générée
// Taille ~800 bytes — pas de dépendances externes

export function buildTrackingScript(pageId: string, apiUrl: string): string {
  return `<script>
(function(){
  var pid=${JSON.stringify(pageId)},base=${JSON.stringify(apiUrl)},sent={};
  function t(e){
    if(sent[e])return;
    sent[e]=1;
    fetch(base+'/api/analytics/track',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({page_id:pid,event_type:e}),
      keepalive:true
    }).catch(function(){});
  }
  // Vue de page
  t('view');
  // Clics CTA
  document.addEventListener('click',function(ev){
    var el=ev.target;
    while(el&&el!==document.body){
      if(el.tagName==='A'||el.tagName==='BUTTON'){
        var txt=(el.innerText||el.textContent||'').toLowerCase();
        var href=el.getAttribute('href')||'';
        if(txt.includes('command')||txt.includes('acheter')||txt.includes('buy')||
           txt.includes('order')||txt.includes('cta')||el.dataset.cta){
          t('cta_click');
        }
        break;
      }
      el=el.parentElement;
    }
  });
  // Scroll depth
  var marks=[25,50,75,100],done={};
  window.addEventListener('scroll',function(){
    var pct=Math.round(
      (window.scrollY+window.innerHeight)/document.documentElement.scrollHeight*100
    );
    marks.forEach(function(m){
      if(pct>=m&&!done[m]){done[m]=1;t('scroll_'+m);}
    });
  },{passive:true});
})();
</script>`
}

// Injecte le script dans un HTML existant (avant </body>)
export function injectTracker(html: string, pageId: string, apiUrl: string): string {
  const script = buildTrackingScript(pageId, apiUrl)
  if (html.includes('</body>')) {
    return html.replace('</body>', `${script}</body>`)
  }
  return html + script
}
