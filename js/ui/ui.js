/* Shell chrome: rail, project card, tabs, mission HUD, DEM popup,
   map tools, split divider, minimap, story width, keyboard shortcuts. */
(function(){
  'use strict';
  const NB=window.NB,$=NB.$,$$=NB.$$;
  const stage=$('#stage'),root=document.documentElement;

  /* ---------- mission HUD ---------- */
  NB.hud={
    base:'Google Maps · Standard',
    kf:'DEM · Recovery phase',
    color:'#3ce8a6',
    render(){
      const t=$('#hudTxt'),h=$('#mapHud');
      if(t)t.textContent=(NB.hud.base+'  ·  '+NB.hud.kf).toUpperCase();
      if(h)h.style.setProperty('--hud-c',NB.hud.color);
    }
  };

  /* ---------- left rail ---------- */
  $$('[data-rail]').forEach(b=>b.addEventListener('click',()=>{
    $$('[data-rail]').forEach(x=>x.classList.remove('active'));b.classList.add('active');
    if(b.hasAttribute('data-help')){
      NB.toast('Shortcuts — Space play · ←/→ keyframes · V vfx panel · F fit view');
    }else{
      NB.toast(b.dataset.tip+' — opened');
    }
  }));
  $$('.proj-av').forEach(b=>b.addEventListener('click',()=>{
    $$('.proj-av').forEach(x=>x.classList.remove('active'));b.classList.add('active');
    const n=$('#projName');if(n)n.textContent=b.dataset.proj;
    NB.toast('Switched to project: '+b.dataset.proj);
  }));
  const bell=$('.bell');
  if(bell)bell.addEventListener('click',()=>NB.toast('Notifications · 1 new alert — NDVI keyframe ready'));
  const me=$('.me');
  if(me)me.addEventListener('click',()=>NB.toast('Account · AZ — settings & billing'));

  /* ---------- project card / tabs ---------- */
  const fold=$('#projFold');
  if(fold)fold.addEventListener('click',()=>{
    const c=$('#projCard');c.classList.toggle('folded');
    NB.toast(c.classList.contains('folded')?'Project card collapsed':'Project card expanded');
  });
  const back=$('#backBtn');
  if(back)back.addEventListener('click',()=>NB.toast('Back to project list'));

  let storyWide=false;
  function syncStoryW(){
    const hidden=$('#storyPanel').classList.contains('hidden');
    root.style.setProperty('--story-w',hidden?'-10px':(storyWide?'600px':'472px'));
    if(NB.map&&NB.map.map)setTimeout(()=>NB.map.map.invalidateSize(),360);
  }
  NB.ui={syncStoryW,setWide(v){storyWide=v;syncStoryW();},isWide:()=>storyWide};

  $$('#tabs .tab').forEach(t=>t.addEventListener('click',()=>{
    $$('#tabs .tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');
    const v=t.dataset.view;
    $('#storyPanel').classList.toggle('hidden',v!=='story');
    syncStoryW();
    NB.toast(v==='story'?'Story view':v.charAt(0).toUpperCase()+v.slice(1)+' view — outside this prototype');
  }));

  /* ---------- DEM popup anchor + drag + actions ---------- */
  const anchor=$('#demAnchor');
  let demPinned=false;   /* true = shown by click, stays until closed */

  function showDemPopup(){
    demPinned=true;
    anchor.classList.add('is-visible');
  }
  function hideDemPopup(){
    demPinned=false;
    anchor.classList.remove('is-visible');
  }
  /* legacy updateAnchor kept for DEM-hide compatibility */
  function updateAnchor(){
    const ndviOn=!NB.tl||NB.tl.ndviOn();
    if(!ndviOn)hideDemPopup();
  }
  NB.ui.updateAnchor=updateAnchor;
  NB.bus.on('dem:hover',({on})=>{ void on; /* hover no longer shows popup */ });
  NB.bus.on('dem:click',()=>{ demPinned?hideDemPopup():showDemPopup(); });

  /* close button inside popup */
  const demCloseBtn=$('#demClose');
  if(demCloseBtn)demCloseBtn.addEventListener('click',e=>{e.stopPropagation();hideDemPopup();});

  /* click outside popup to close */
  document.addEventListener('click',e=>{
    if(demPinned&&!e.target.closest('#demAnchor'))hideDemPopup();
  });

  NB.dragXY($('#demHead'),e=>{
    const r=stage.getBoundingClientRect();
    let x=((e.clientX-r.left)/r.width)*100,y=((e.clientY-r.top)/r.height)*100;
    x=NB.clamp(x-9,2,82);y=NB.clamp(y-2,2,60);
    anchor.style.left=x+'%';anchor.style.top=y+'%';
  });

  $$('.dem-actions .ibtn').forEach(b=>b.addEventListener('click',()=>{
    const a=b.dataset.act;
    if(a==='download')NB.toast('Downloading DEM GeoTIFF… 84 MB');
    else if(a==='reset'){const o=$('#opacity');o.value=100;o.dispatchEvent(new Event('input'));NB.toast('DEM layer reset');}
    else if(a==='zoomin'){NB.map.flyHome();NB.toast('Zoomed to DEM extent');}
    else if(a==='elev')NB.toast('Elevation profile — draw a line on the map');
    else if(a==='split')setSplit(!splitOn);
    else if(a==='layers')NB.toast('Layer stack — 2 layers active');
    else if(a==='hide'){NB.tl.setNdvi(!NB.tl.ndviOn());NB.toast(NB.tl.ndviOn()?'DEM layer shown':'DEM layer hidden');}
  }));

  /* ---------- split / reveal ---------- */
  let splitOn=false;
  function setSplit(on){
    splitOn=on;stage.classList.toggle('split-on',on);
    $('#demSplit').classList.toggle('toggled',on);
    $('#mtoolSplit').classList.toggle('toggled',on);
    NB.toast(on?'Split / reveal mode on — drag the divider':'Split mode off');
  }
  NB.ui.setSplit=setSplit;NB.ui.splitOn=()=>splitOn;
  NB.dragXY($('#splitGrip'),e=>{
    const r=stage.getBoundingClientRect();
    let p=((e.clientX-r.left)/r.width)*100;
    stage.style.setProperty('--split',NB.clamp(p,8,92)+'%');
  });

  /* ---------- map tools ---------- */
  $$('.mtool').forEach(b=>b.addEventListener('click',()=>{
    const m=b.dataset.mtool;
    if(!m)return; /* vfx button handled in vfx.js */
    if(m==='split'){setSplit(!splitOn);return;}
    if(m==='zin'){NB.map.zoom(1);return;}
    if(m==='zout'){NB.map.zoom(-1);return;}
    const on=b.classList.toggle('toggled');
    if(m==='fit'){b.classList.remove('toggled');NB.map.flyHome();NB.toast('Fitted to area bounds');}
    else if(m==='info')NB.toast(on?'Pixel inspect on — click the map to sample':'Pixel inspect off');
    else if(m==='measure')NB.toast(on?'Measure tool on — click two points':'Measure tool off');
  }));

  const mm=$('#minimap');
  if(mm)mm.addEventListener('click',()=>{NB.map.flyHome();NB.toast('Recentred from overview map');});

  /* ---------- keyboard shortcuts ---------- */
  document.addEventListener('keydown',e=>{
    if(e.target.matches('input,textarea,select'))return;
    if(e.code==='Space'){e.preventDefault();NB.tl.togglePlay();}
    else if(e.key==='ArrowLeft')NB.tl.prevKf();
    else if(e.key==='ArrowRight')NB.tl.nextKf();
    else if(e.key==='v'||e.key==='V')NB.vfx.togglePanel();
    else if(e.key==='f'||e.key==='F'){NB.map.flyHome();}
    else if(e.key==='Escape'){
      $('#layersMenu').classList.remove('open');
      $('#vfxPanel').classList.remove('open');
      const vb=$('#vfxBtn');if(vb)vb.classList.remove('toggled');
      NB.tl.stop();
    }
  });
})();