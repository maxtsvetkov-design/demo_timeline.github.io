/* Boot sequence: minimum splash dwell → fade → release entrance reveals. */
(function(){
  'use strict';
  const NB=window.NB,$=NB.$;
  const BOOT_MIN=750,t0=performance.now();

  NB.reveal.init();
  NB.hud.render();

  function finishBoot(){
    const boot=$('#boot');
    if(boot){boot.classList.add('done');setTimeout(()=>boot.remove(),900);}
    document.body.classList.add('ready');
    if(NB.map&&NB.map.map)setTimeout(()=>NB.map.map.invalidateSize(),120);
  }
  const wait=Math.max(0,BOOT_MIN-(performance.now()-t0));
  window.addEventListener('load',()=>setTimeout(finishBoot,wait));
  /* safety: never strand the splash */
  setTimeout(()=>{if(!document.body.classList.contains('ready'))finishBoot();},3500);

  console.log('%cnabat · GIS story prototype — aurora build','color:#3ce8a6;font-weight:600');
  console.log('%cdecompose: split each ‹style›/‹script data-file› block into the path named in its attribute','color:#6f7f77');
})();