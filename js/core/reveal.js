/* Entrance choreography: data-reveal (released by body.ready),
   data-reveal-io + count-up numbers (released on scroll into view). */
(function(){
  'use strict';
  const NB=window.NB;

  /* shared IntersectionObserver */
  NB.io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting)return;
      const el=en.target;
      if(el.hasAttribute('data-reveal-io'))el.classList.add('revealed');
      NB.$$('[data-count]',el).concat(el.matches('[data-count]')?[el]:[]).forEach(runCount);
      NB.io.unobserve(el);
    });
  },{threshold:.25});

  function fmt(v,dec,eu){
    let s=v.toFixed(dec);
    if(eu)s=s.replace('.',',');
    return s;
  }

  function runCount(el){
    if(el.__counted)return;el.__counted=true;
    const target=parseFloat(el.dataset.count||'0');
    const dec=parseInt(el.dataset.decimals||'0',10);
    const eu=el.dataset.format==='eu';
    const pre=el.dataset.prefix||'', suf=el.dataset.suffix||'';
    if(NB.reduced){el.textContent=pre+fmt(target,dec,eu)+suf;return;}
    const dur=1100+Math.random()*300;
    let t0=null;
    function step(t){
      if(!t0)t0=t;
      const p=NB.clamp((t-t0)/dur,0,1);
      el.textContent=pre+fmt(target*NB.ease.outCubic(p),dec,eu)+suf;
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  NB.reveal={
    init(){
      NB.$$('[data-reveal-io]').forEach(el=>NB.io.observe(el));
      /* count-ups not inside a data-reveal-io container */
      NB.$$('[data-count]').forEach(el=>{
        if(!el.closest('[data-reveal-io]'))NB.io.observe(el);
      });
    }
  };
})();