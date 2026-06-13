/* Timeline: ranges, basemap frames, DEM keyframes, playback (cinema mode),
   layer rows (eyes / drag-reorder), add-layers menu, reset. */
(function(){
  'use strict';
  const NB=window.NB,$=NB.$,$$=NB.$$;
  const stage=$('#stage');

  /* \u2500\u2500 panel resize \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
     Height breakpoints (px): 80 | 140 | 210 | 290 | 380
     Width breakpoints  (px): 180 | 236 | 300 | 380 | 480   (label column) */
  const TL_H_BP=[80,140,210,290,380];
  const TL_W_BP=[180,236,300,380,480];
  const TL_H_DEFAULT=null; /* auto */
  const TL_W_DEFAULT=236;

  const tlEl=$('.timeline');
  const tlTop=$('#tlResizeTop');
  const tlRight=$('#tlResizeRight');

  let tlH=TL_H_DEFAULT, tlW=TL_W_DEFAULT, tlPanelW=null;

  function snapH(raw){
    const clamped=Math.max(TL_H_BP[0],Math.min(TL_H_BP[TL_H_BP.length-1],raw));
    return TL_H_BP.reduce((best,v)=>Math.abs(v-clamped)<Math.abs(best-clamped)?v:best);
  }
  function snapW(raw){
    const clamped=Math.max(TL_W_BP[0],Math.min(TL_W_BP[TL_W_BP.length-1],raw));
    return TL_W_BP.reduce((best,v)=>Math.abs(v-clamped)<Math.abs(best-clamped)?v:best);
  }
  function applyTlH(px,snap){
    const v=snap?snapH(px):Math.max(TL_H_BP[0],px);
    tlH=v;
    tlEl.style.setProperty('--tl-h',v+'px');
    const labels=tlEl.querySelector('#tlLabels');
    if(labels){
      const overflow=labels.scrollHeight>labels.clientHeight+4;
      tlEl.classList.toggle('tl-scrolling',overflow);
    }
    if(NB.map&&NB.map.map)NB.map.map.resize();
  }
  function applyTlPanelW(px){
    const stageW=stage?stage.getBoundingClientRect().width:window.innerWidth;
    const storyWNum=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--story-w'))||472;
    const maxW=Math.max(300, stageW-storyWNum-38);
    const v=Math.max(240, Math.min(maxW, px));
    tlPanelW=v;
    tlEl.style.setProperty('--tl-panel-w',v+'px');
    /* cap label column if now wider than panel */
    const maxLabelW=v-60;
    if(tlW>maxLabelW){ tlW=Math.max(TL_W_BP[0],maxLabelW); tlEl.style.setProperty('--tl-w',tlW+'px'); }
    tlEl.classList.toggle('tl-compact', tlW<=TL_W_BP[0] || v<420);
    if(NB.map&&NB.map.map)NB.map.map.resize();
  }
  function applyTlW(px,snap){
    const panelW=tlPanelW||tlEl.getBoundingClientRect().width;
    const maxLabelW=panelW-60;
    const raw=Math.min(px,maxLabelW);
    const v=snap?snapW(raw):Math.max(TL_W_BP[0],Math.min(TL_W_BP[TL_W_BP.length-1],raw));
    tlW=v;
    tlEl.style.setProperty('--tl-w',v+'px');
    tlEl.classList.toggle('tl-compact', v<=TL_W_BP[0] || panelW<420);
  }

  /* vertical resize (top grip \u2192 drag up = taller) */
  if(tlTop&&tlEl){
    let startY=0,startH=0;
    tlTop.addEventListener('pointerdown',e=>{
      e.preventDefault();
      startY=e.clientY;
      startH=tlEl.getBoundingClientRect().height;
      tlEl.classList.add('tl-resizing');
      tlTop.setPointerCapture(e.pointerId);
    });
    tlTop.addEventListener('pointermove',e=>{
      if(!tlEl.classList.contains('tl-resizing'))return;
      const dy=startY-e.clientY; /* drag up \u2192 positive \u2192 bigger */
      applyTlH(startH+dy,false);
    });
    const endTop=e=>{
      if(!tlEl.classList.contains('tl-resizing'))return;
      const dy=startY-e.clientY;
      applyTlH(startH+dy,true); /* snap on release */
      tlEl.classList.remove('tl-resizing');
      NB.toast('Timeline height \u2192 '+tlH+'px');
    };
    tlTop.addEventListener('pointerup',endTop);
    tlTop.addEventListener('pointercancel',endTop);
  }

  /* right grip \u2192 resize entire panel width; drag left = shrink, reveals map */
  if(tlRight&&tlEl){
    let startX=0,startPW=0;
    tlRight.addEventListener('pointerdown',e=>{
      e.preventDefault();
      startX=e.clientX;
      startPW=tlEl.getBoundingClientRect().width;
      tlEl.classList.add('tl-resizing');
      tlRight.setPointerCapture(e.pointerId);
    });
    tlRight.addEventListener('pointermove',e=>{
      if(!tlEl.classList.contains('tl-resizing'))return;
      applyTlPanelW(startPW+(e.clientX-startX));
    });
    const endRight=e=>{
      if(!tlEl.classList.contains('tl-resizing'))return;
      applyTlPanelW(startPW+(e.clientX-startX));
      tlEl.classList.remove('tl-resizing');
      NB.toast('Timeline width \u2192 '+Math.round(tlPanelW||tlEl.getBoundingClientRect().width)+'px');
    };
    tlRight.addEventListener('pointerup',endRight);
    tlRight.addEventListener('pointercancel',endRight);
  }

  /* keep compact class in sync with panel width (story-panel toggle, viewport resize) */
  if(tlEl&&typeof ResizeObserver!=='undefined'){
    new ResizeObserver(()=>{
      const panelW=tlEl.getBoundingClientRect().width;
      tlEl.classList.toggle('tl-compact', tlW<=TL_W_BP[0] || panelW<420);
    }).observe(tlEl);
  }

  /* ---------- rulers / ranges ---------- */
  const rulers={
    '1H':['09:00','09:15','09:30','09:45'],'6H':['06:00','10:00','14:00','18:00'],
    '24H':['13 MAR','28 MAR','12 APR','27 APR'],'7D':['MON','WED','FRI','SUN'],
    '30D':['W 1','W 2','W 3','W 4'],'YTD':['JAN','MAR','MAY','JUL'],'Custom':['13 MAR','28 MAR','12 APR','27 APR']};
  function setRuler(keys){
    $('#ruler').innerHTML=keys.map((k,i)=>'<i style="left:'+(12.5+i*25)+'%">'+k+'</i>').join('');
  }
  setRuler(rulers['24H']);
  $$('[data-range]').forEach(c=>c.addEventListener('click',()=>{
    $$('[data-range]').forEach(x=>x.classList.remove('active'));c.classList.add('active');
    setRuler(rulers[c.dataset.range]);
    NB.toast(c.dataset.range==='Custom'?'Custom range picker (prototype)':'Range: '+c.dataset.range);
  }));
  $('#panBtn').addEventListener('click',e=>{
    e.target.classList.toggle('active');
    NB.toast(e.target.classList.contains('active')?'Pan mode on — drag the map':'Pan mode off');
  });

  /* ---------- basemap frames + thumbs ---------- */
  const thumbDates=['14 Mar 2025','28 Mar 2025','12 Apr 2025','27 Apr 2025'];
  const basemapFrames=[
    {date:'14 Mar 2025',filter:'saturate(.76) contrast(.92) brightness(.58)',tileOpacity:.95,label:'Google Maps · Standard'},
    {date:'28 Mar 2025',filter:'saturate(.92) contrast(1.02) brightness(.62)',tileOpacity:.88,label:'Google Maps · Vegetation'},
    {date:'12 Apr 2025',filter:'saturate(.68) contrast(1.08) brightness(.52)',tileOpacity:.82,label:'Google Maps · Relief'},
    {date:'27 Apr 2025',filter:'saturate(.82) contrast(.96) brightness(.6)',tileOpacity:.92,label:'Google Maps · Fresh'}
  ];
  let activeBasemapIndex=-1;
  function applyBasemapFrame(index){
    const i=NB.clamp(index,0,basemapFrames.length-1),frame=basemapFrames[i];
    $('#basemapDate').textContent=frame.date+' ‹';
    const cd=$('#currentDateLabel');if(cd)cd.textContent='Current date: '+frame.date;
    NB.hud.base=frame.label;NB.hud.render();
    NB.map.setTileStyle(frame.filter,frame.tileOpacity);
    NB.map.setBaseImage(i);
    activeBasemapIndex=i;
  }
  const baseTrack=$('#tracks .track.basemap-track');
  thumbDates.forEach((d,i)=>{
    const b=document.createElement('button');b.className='thumb';b.style.left=(7+i*21.5)+'%';
    b.setAttribute('data-tip',d);
    b.innerHTML='<img src="'+NB.map.tex.base[i]+'" alt="Basemap thumbnail '+d+'" style="width:100%;height:100%;object-fit:cover;display:block">';
    b.addEventListener('click',()=>{applyBasemapFrame(i);NB.toast('Basemap → '+d);});
    if(baseTrack)baseTrack.appendChild(b);
  });

  /* ---------- keyframes / DEM frames ---------- */
  const kfs=$$('.kf'),playhead=$('#playhead'),tracksEl=$('#tracks');
  const kfVisuals=[
    {color:'#3ce8a6',label:'DEM · Recovery phase',overlayMul:.85},
    {color:'#6ecbff',label:'DEM · Mid-season change',overlayMul:1},
    {color:'#ffd76a',label:'DEM · Peak uplift',overlayMul:.75}
  ];
  const ndviFrames=kfs.map((k,i)=>({idx:i,pos:parseFloat(k.dataset.pos),date:k.dataset.date||''}));

  let ndviVisible=true,activeKfIndex=0;
  const layerOpacity={dem:1,basemap:1,osm:1};
  const opacity=$('#opacity');
  function applyKfVisual(index){
    const i=NB.clamp(index,0,kfVisuals.length-1),v=kfVisuals[i];
    activeKfIndex=i;
    const base=Number(opacity.value||100)/100;
    NB.map.setDemOpacity(ndviVisible?Math.min(1,base*v.overlayMul*layerOpacity.dem):0);
    NB.hud.kf=v.label;NB.hud.color=v.color;NB.hud.render();
  }
  opacity.addEventListener('input',()=>{
    opacity.style.setProperty('--fill',opacity.value+'%');
    applyKfVisual(activeKfIndex);
  });

  function nearestFrame(p){
    let best=ndviFrames[0],bd=Math.abs(p-best.pos);
    ndviFrames.forEach(f=>{const d=Math.abs(p-f.pos);if(d<bd){best=f;bd=d;}});
    return best;
  }
  function syncDemByPos(p){
    const f=nearestFrame(p);if(!f)return;
    NB.map.setDemImage(f.idx);
    applyKfVisual(f.idx);
  }

  /* ---------- playhead / playback ---------- */
  let pos=0,playing=false,raf=null,lastT=0,litIdx=-1;
  function setPos(p){
    pos=NB.clamp(p,0,100);playhead.style.left=pos+'%';
    let hitIdx=-1;
    kfs.forEach((k,i)=>{
      const near=Math.abs(parseFloat(k.dataset.pos)-pos)<2;
      k.classList.toggle('lit',near);
      if(near)hitIdx=i;
    });
    if(hitIdx>-1&&hitIdx!==litIdx){
      const k=kfs[hitIdx];
      k.classList.remove('hit');void k.offsetWidth;k.classList.add('hit');
      NB.bus.emit('kf:hit',{index:hitIdx,pos:parseFloat(k.dataset.pos),date:k.dataset.date});
    }
    litIdx=hitIdx;
    const i=Math.min(thumbDates.length-1,Math.floor(pos/100*thumbDates.length));
    if(i!==activeBasemapIndex)applyBasemapFrame(i);
    syncDemByPos(pos);
  }
  kfs.forEach(k=>k.addEventListener('click',()=>{setPos(parseFloat(k.dataset.pos));NB.toast('Keyframe · '+k.dataset.date);}));

  function posFromX(clientX){
    const r=tracksEl.getBoundingClientRect();
    return((clientX-r.left)/r.width)*100;
  }
  let dragPH=false;
  function startPHDrag(e){
    if(e.button!==undefined&&e.button!==0)return;
    dragPH=true;stop();setPos(posFromX(e.clientX));e.preventDefault();
  }
  playhead.addEventListener('pointerdown',startPHDrag);
  tracksEl.addEventListener('pointerdown',e=>{
    if(e.target.closest('.kf,.thumb'))return;
    startPHDrag(e);
  });
  window.addEventListener('pointermove',e=>{if(dragPH)setPos(posFromX(e.clientX));});
  window.addEventListener('pointerup',()=>{dragPH=false;});
  window.addEventListener('pointercancel',()=>{dragPH=false;});
  tracksEl.addEventListener('click',e=>{
    if(e.target.closest('.kf,.thumb'))return;
    setPos(posFromX(e.clientX));
  });

  function tick(t){
    if(!playing)return;
    if(!lastT)lastT=t;
    const dt=t-lastT;lastT=t;
    setPos(pos+dt/9000*100);
    if(pos>=100){stop();setPos(100);NB.toast('Playback finished');return;}
    raf=requestAnimationFrame(tick);
  }
  function play(){
    playing=true;lastT=0;if(pos>=100)setPos(0);
    $('#playBtn').classList.add('playing');$('#playUse').setAttribute('href','#i-pause');$('#playLbl').textContent='Pause';
    tracksEl.classList.add('playing');
    NB.bus.emit('play');
    raf=requestAnimationFrame(tick);
  }
  function stop(){
    if(!playing&&!raf)return;
    playing=false;cancelAnimationFrame(raf);raf=null;
    $('#playBtn').classList.remove('playing');$('#playUse').setAttribute('href','#i-play');$('#playLbl').textContent='Play';
    tracksEl.classList.remove('playing');
    NB.bus.emit('pause');
  }
  $('#playBtn').addEventListener('click',()=>playing?stop():play());
  function prevKf(){const ps=kfs.map(k=>+k.dataset.pos).filter(p=>p<pos-1);setPos(ps.length?Math.max(...ps):0);}
  function nextKf(){const ps=kfs.map(k=>+k.dataset.pos).filter(p=>p>pos+1);setPos(ps.length?Math.min(...ps):100);}
  $('#prevK').addEventListener('click',prevKf);
  $('#nextK').addEventListener('click',nextKf);

  /* ---------- timeline zoom ---------- */
  let tlScale=1;
  function applyTl(){tracksEl.style.setProperty('--tlw',(tlScale*100)+'%');}
  $('#tlPlus').addEventListener('click',()=>{tlScale=Math.min(3,tlScale+0.5);applyTl();NB.toast('Timeline zoom ×'+tlScale.toFixed(1));});
  $('#tlMinus').addEventListener('click',()=>{tlScale=Math.max(1,tlScale-0.5);applyTl();NB.toast('Timeline zoom ×'+tlScale.toFixed(1));});

  /* ---------- layer visibility ---------- */
  function setNdvi(on){
    ndviVisible=!!on;
    stage.classList.toggle('ndvi-off',!ndviVisible);
    applyKfVisual(activeKfIndex);
    NB.ui.updateAnchor();
    const eyeUse=$('#eyeNdviUse');if(eyeUse)eyeUse.setAttribute('href',on?'#i-eye':'#i-eye-off');
    const eye=$('#eyeNdvi');if(eye)eye.classList.toggle('on',on);
    const demHideUse=$('#demHideUse');if(demHideUse)demHideUse.setAttribute('href',on?'#i-eye-off':'#i-eye');
    const mi=$('.lm-item[data-layer="dem"]');if(mi){mi.classList.toggle('on',on);mi.setAttribute('aria-selected',String(!!on));}
  }
  let baseOn=true;
  function setBase(on){
    baseOn=!!on;stage.classList.toggle('basemap-off',!baseOn);
    const eyeUse=$('#eyeBaseUse');if(eyeUse)eyeUse.setAttribute('href',on?'#i-eye':'#i-eye-off');
    const eye=$('#eyeBase');if(eye)eye.classList.toggle('on',on);
    const mi=$('.lm-item[data-layer="basemap"]');if(mi){mi.classList.toggle('on',on);mi.setAttribute('aria-selected',String(!!on));}
    NB.map.setBaseOpacity(baseOn?layerOpacity.basemap:0);
  }
  let osmOn=true;
  function setOsm(on){
    osmOn=!!on;
    const eyeUse=$('#eyeOsmUse');if(eyeUse)eyeUse.setAttribute('href',on?'#i-eye':'#i-eye-off');
    const eye=$('#eyeOsm');if(eye)eye.classList.toggle('on',on);
    NB.map.setOsmOpacity(osmOn?layerOpacity.osm:0);
    const mi=$('.lm-item[data-layer="osm"]');if(mi){mi.classList.toggle('on',on);mi.setAttribute('aria-selected',String(!!on));}
  }
  function applyLayerOrder(){
    const labels=$('#tlLabels');
    if(!labels)return;
    const rows=$$('.layer-row',labels);
    const ph=tracksEl.querySelector('#playhead');
    rows.forEach(row=>{
      const track=tracksEl.querySelector('.track[data-track-layer="'+row.dataset.layer+'"]');
      if(track)tracksEl.insertBefore(track,ph);
    });
    NB.map.applyOrder(rows.map(r=>r.dataset.layer));
  }

  function setLayerOpacity(layer,v){
    const val=NB.clamp(Number(v),0,1);
    layerOpacity[layer]=val;
    if(layer==='dem')applyKfVisual(activeKfIndex);
    if(layer==='basemap')NB.map.setBaseOpacity(baseOn?val:0);
    if(layer==='osm')NB.map.setOsmOpacity(osmOn?val:0);
    if(layer!=='dem'&&layer!=='basemap'&&layer!=='osm'&&NB.map.setOverlayOpacity)NB.map.setOverlayOpacity(layer,val);
    const row=$('#tlLabels .layer-row[data-layer="'+layer+'"]');
    if(row)row.style.setProperty('--layer-opacity',val.toFixed(2));
    const track=$('#tracks .track[data-track-layer="'+layer+'"]');
    if(track)track.style.setProperty('--layer-opacity',val.toFixed(2));
  }

  /* ---------- reset ---------- */
  $('#resetBtn').addEventListener('click',()=>{
    stop();setPos(0);tlScale=1;applyTl();
    opacity.value=100;opacity.dispatchEvent(new Event('input'));
    setNdvi(true);
    if(NB.ui.splitOn())NB.ui.setSplit(false);
    if(!baseOn)setBase(true);
    if(!osmOn)setOsm(true);
    setLayerOpacity('dem',1);
    setLayerOpacity('basemap',1);
    setLayerOpacity('osm',1);
    $$('[data-range]').forEach(x=>x.classList.toggle('active',x.dataset.range==='24H'));
    setRuler(rulers['24H']);
    NB.bus.emit('timeline:reset');
    NB.toast('View reset to defaults');
  });

  /* ---------- public api + init ---------- */
  NB.tl={
    setNdvi,setOsm,setBase,
    ndviOn:()=>ndviVisible,baseOn:()=>baseOn,osmOn:()=>osmOn,
    setLayerOpacity,applyLayerOrder,
    togglePlay:()=>playing?stop():play(),play,stop,prevKf,nextKf,setPos
  };
  setPos(0);
  NB.map.setOsmOpacity(layerOpacity.osm);

  if(NB.layerPanel&&typeof NB.layerPanel.init==='function'){
    NB.layerPanel.init({
      setNdvi,
      setBase,
      setOsm,
      setLayerVisible:(layer,on)=>NB.map.setOverlayVisibility&&NB.map.setOverlayVisibility(layer,on),
      setLayerOpacity,
      onOrderChange:keys=>NB.map.applyOrder(keys)
    });
    NB.bus.on('timeline:reset',()=>NB.layerPanel.resetDynamic());
  }
})();