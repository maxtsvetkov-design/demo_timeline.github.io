/* Canvas VFX engine + mission-control panel.
   Effects: spore particles, satellite scan, sonar pulses (kf-reactive),
   cloud shadows, tactical grid, energy flashes — plus CSS layers
   (aurora, film grain) toggled via stage classes. Auto-tunes density
   against frame budget. */
(function(){
  'use strict';
  const NB=window.NB,$=NB.$,$$=NB.$$;
  const stage=$('#stage'),cv=$('#vfxCanvas');
  if(!cv)return;
  const ctx=cv.getContext('2d');

  const S={
    master:!NB.reduced,
    intensity:.8,speed:1,density:.55,
    particles:false,pulses:true,clouds:true,
    aurora:true,
    boost:1 /* cinema multiplier while playing */
  };
  NB.vfx={state:S};

  /* ---------- sizing ---------- */
  let W=0,H=0,DPR=1;
  function resize(){
    DPR=Math.min(2,window.devicePixelRatio||1);
    const r=stage.getBoundingClientRect();
    W=Math.max(2,r.width);H=Math.max(2,r.height);
    cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
    seedClouds();
  }

  /* ---------- particles ---------- */
  const COLS=['rgba(60,232,166,',  'rgba(255,215,106,', 'rgba(140,210,255,'];
  let parts=[];
  function maxParts(){return Math.round((W*H)/9000*S.density)}
  function newPart(anyY){
    return{
      x:Math.random()*W,
      y:anyY?Math.random()*H:H+10+Math.random()*30,
      vx:(Math.random()-.5)*7,vy:-(5+Math.random()*11),
      r:.7+Math.random()*1.9,
      c:COLS[(Math.random()*COLS.length)|0],
      ph:Math.random()*Math.PI*2,
      tw:.6+Math.random()*1.6
    };
  }
  function seedParticles(){
    const n=maxParts();parts=[];
    for(let i=0;i<n;i++)parts.push(newPart(true));
  }
  function drawParticles(dt,t){
    const target=maxParts();
    while(parts.length<target)parts.push(newPart(false));
    if(parts.length>target)parts.length=target;
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(const p of parts){
      p.x+=p.vx*dt*S.speed;p.y+=p.vy*dt*S.speed;
      p.x+=Math.sin(t*.0006+p.ph)*.12;
      if(p.y<-12||p.x<-12||p.x>W+12)Object.assign(p,newPart(false));
      const a=(0.16+0.5*Math.abs(Math.sin(t*.001*p.tw+p.ph)))*S.intensity*S.boost;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.c+a.toFixed(3)+')';ctx.fill();
    }
    ctx.restore();
  }

  /* ---------- clouds ---------- */
  let clouds=[];
  function seedClouds(){
    clouds=[0,1,2,3].map(i=>({
      x:Math.random()*W,y:Math.random()*H*.8,
      rx:W*(.22+Math.random()*.2),ry:H*(.16+Math.random()*.12),
      v:4+Math.random()*7,a:.10+Math.random()*.08
    }));
  }
  function drawClouds(dt){
    for(const c of clouds){
      c.x+=c.v*dt*S.speed;
      if(c.x-c.rx>W)c.x=-c.rx;
      const g=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,c.rx);
      const a=c.a*S.intensity;
      g.addColorStop(0,'rgba(2,8,6,'+(a).toFixed(3)+')');
      g.addColorStop(.7,'rgba(2,8,6,'+(a*.5).toFixed(3)+')');
      g.addColorStop(1,'rgba(2,8,6,0)');
      ctx.save();ctx.translate(c.x,c.y);ctx.scale(1,c.ry/c.rx);ctx.translate(-c.x,-c.y);
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(c.x,c.y,c.rx,0,Math.PI*2);ctx.fill();ctx.restore();
    }
  }

  /* ---------- tactical grid ---------- */
  function drawGrid(t){
    const step=84,off=(t*.004*S.speed)%step;
    ctx.save();ctx.strokeStyle='rgba(60,232,166,'+(0.05*S.intensity).toFixed(3)+')';
    ctx.lineWidth=1;ctx.setLineDash([3,9]);
    for(let x=-step+off;x<W;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=-step+off*.6;y<H;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.restore();
  }

  /* ---------- satellite scan ---------- */
  let scanT=0;
  function drawScan(dt){
    const period=8.5/S.speed;
    scanT=(scanT+dt)%(period+2.5);
    const p=scanT/period;
    if(p>1)return;
    const x=NB.lerp(-120,W+120,p),bw=130;
    const g=ctx.createLinearGradient(x-bw,0,x+bw,0);
    const a=.13*S.intensity*S.boost;
    g.addColorStop(0,'rgba(60,232,166,0)');
    g.addColorStop(.5,'rgba(120,255,205,'+a.toFixed(3)+')');
    g.addColorStop(1,'rgba(60,232,166,0)');
    ctx.fillStyle=g;ctx.fillRect(x-bw,0,bw*2,H);
    ctx.fillStyle='rgba(190,255,228,'+(a*1.7).toFixed(3)+')';
    ctx.fillRect(x-1,0,2,H);
  }

  /* ---------- sonar pulses ---------- */
  let rings=[],ambT=0;
  function epicenter(){
    const p=NB.map&&NB.map.toPoint&&NB.map.toPoint(NB.map.aoi);
    return p?{x:p.x,y:p.y}:{x:W*.5,y:H*.45};
  }
  function spawnRing(strong){
    const e=epicenter();
    rings.push({x:e.x,y:e.y,r:6,max:strong?Math.max(W,H)*.5:240,sp:strong?260:120,a:strong?.5:.3,w:strong?2.2:1.4});
  }
  function drawPulses(dt){
    ambT+=dt;
    if(ambT>4.6/S.speed){ambT=0;spawnRing(false);}
    rings=rings.filter(r=>r.r<r.max);
    for(const r of rings){
      r.r+=r.sp*dt*S.speed;
      const k=1-r.r/r.max;
      ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,Math.PI*2);
      ctx.strokeStyle='rgba(60,232,166,'+(r.a*k*S.intensity*S.boost).toFixed(3)+')';
      ctx.lineWidth=r.w;ctx.stroke();
    }
  }

  /* ---------- energy flash ---------- */
  let flashA=0,flashNext=9+Math.random()*8;
  function drawFlash(dt){
    flashNext-=dt*S.speed;
    if(flashNext<=0){flashA=.5;flashNext=9+Math.random()*9;}
    if(flashA>0.002){
      flashA*=Math.pow(.0018,dt);
      const e=epicenter();
      const g=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,Math.max(W,H)*.6);
      g.addColorStop(0,'rgba(150,255,215,'+(flashA*.4*S.intensity).toFixed(3)+')');
      g.addColorStop(1,'rgba(150,255,215,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    }
  }

  /* ---------- loop + fps auto-tune ---------- */
  let last=0,fpsAcc=0,fpsN=0,fpsTimer=0,tuneCool=0,tuned=false;
  function frame(t){
    requestAnimationFrame(frame);
    if(!last)last=t;
    let dt=(t-last)/1000;last=t;
    dt=Math.min(dt,.05);
    if(!S.master){if(cv.__dirty){ctx.clearRect(0,0,W,H);cv.__dirty=false;}return;}
    cv.__dirty=true;
    ctx.clearRect(0,0,W,H);
    if(S.clouds)drawClouds(dt);
    if(S.particles)drawParticles(dt,t);
    if(S.pulses)drawPulses(dt);

    /* fps */
    fpsAcc+=dt;fpsN++;fpsTimer+=dt;tuneCool-=dt;
    if(fpsTimer>=.5){
      const avg=fpsAcc/fpsN;
      const fpsEl=$('#fxFps'),cntEl=$('#fxCount');
      if(fpsEl)fpsEl.textContent=String(Math.round(1/avg));
      if(cntEl)cntEl.textContent=String(parts.length);
      if(avg>.034&&tuneCool<=0&&S.density>.15){
        S.density=Math.max(.15,S.density-.1);tuned=true;tuneCool=2;
        const d=$('#fxDensity');if(d){d.value=String(Math.round(S.density*100));d.style.setProperty('--fill',d.value+'%');}
        const tn=$('#fxTune');if(tn)tn.textContent='AUTO-TUNED ↓';
      }else if(!tuned){
        const tn=$('#fxTune');if(tn)tn.textContent='AUTO-TUNE ON';
      }
      fpsAcc=0;fpsN=0;fpsTimer=0;
    }
  }

  /* ---------- CSS-layer effects ---------- */
  function applyCssFx(){
    stage.classList.toggle('fx-aurora',S.master&&S.aurora);
    stage.classList.remove('fx-grain');
  }

  /* ---------- panel wiring ---------- */
  const panel=$('#vfxPanel'),btn=$('#vfxBtn');
  function setPanel(open){
    if(!panel)return;
    panel.classList.toggle('open',open);
    if(btn)btn.classList.toggle('toggled',open);
  }
  NB.vfx.togglePanel=()=>setPanel(!panel.classList.contains('open'));
  if(btn)btn.addEventListener('click',()=>NB.vfx.togglePanel());
  const closeB=$('#fxClose');
  if(closeB)closeB.addEventListener('click',()=>setPanel(false));

  function syncSwitch(el,on){
    el.classList.toggle('on',on);
    el.setAttribute('aria-checked',on?'true':'false');
  }
  function syncPanel(){
    const m=$('#fxMaster');if(m)syncSwitch(m,S.master);
    $$('[data-fxsw]').forEach(sw=>syncSwitch(sw,!!S[sw.dataset.fxsw]));
    const i=$('#fxIntensity');if(i){i.value=String(Math.round(S.intensity*100));i.style.setProperty('--fill',i.value+'%');}
    const sp=$('#fxSpeed');if(sp){sp.value=String(Math.round(S.speed*100));sp.style.setProperty('--fill',((S.speed*100-25)/175*100)+'%');}
    const d=$('#fxDensity');if(d){d.value=String(Math.round(S.density*100));d.style.setProperty('--fill',d.value+'%');}
    applyCssFx();
  }
  const mEl=$('#fxMaster');
  if(mEl)mEl.addEventListener('click',()=>{S.master=!S.master;syncPanel();
    NB.toast(S.master?'Map VFX enabled':'Map VFX disabled');});
  $$('[data-fxsw]').forEach(sw=>sw.addEventListener('click',()=>{
    const k=sw.dataset.fxsw;S[k]=!S[k];syncPanel();
  }));
  const iEl=$('#fxIntensity');
  if(iEl)iEl.addEventListener('input',()=>{S.intensity=iEl.value/100;iEl.style.setProperty('--fill',iEl.value+'%');});
  const spEl=$('#fxSpeed');
  if(spEl)spEl.addEventListener('input',()=>{S.speed=spEl.value/100;
    spEl.style.setProperty('--fill',((spEl.value-25)/175*100)+'%');});
  const dEl=$('#fxDensity');
  if(dEl)dEl.addEventListener('input',()=>{S.density=dEl.value/100;dEl.style.setProperty('--fill',dEl.value+'%');});

  const PRESETS={
    off:{master:false},
    calm:{master:true,intensity:.45,speed:.7,density:.3,particles:false,pulses:true,clouds:true,aurora:true},
    cine:{master:true,intensity:.8,speed:1,density:.55,particles:false,pulses:true,clouds:true,aurora:true},
    max:{master:true,intensity:1,speed:1.25,density:.85,particles:false,pulses:true,clouds:true,aurora:true}
  };
  $$('.fx-preset').forEach(b=>b.addEventListener('click',()=>{
    $$('.fx-preset').forEach(x=>x.classList.remove('active'));b.classList.add('active');
    Object.assign(S,PRESETS[b.dataset.fxpreset]||{});
    syncPanel();NB.toast('VFX preset · '+b.textContent);
  }));

  /* ---------- bus reactions ---------- */
  /* ── border glow on kf:hit (replaces sonar rings) ── */
  const mapReal=document.getElementById('stageMap');
  NB.bus.on('kf:hit',()=>{
    if(!S.master||!S.pulses)return;
    if(!mapReal)return;
    mapReal.classList.remove('kf-glow');
    void mapReal.offsetWidth; /* force reflow to restart animation */
    mapReal.classList.add('kf-glow');
    setTimeout(()=>mapReal.classList.remove('kf-glow'),800);
  });
  NB.bus.on('play',()=>{S.boost=1.25;});
  NB.bus.on('pause',()=>{S.boost=1;});

  /* ---------- init ---------- */
  window.addEventListener('resize',resize);
  resize();
  if(NB.reduced){S.master=false;}
  syncPanel();
  requestAnimationFrame(frame);
})();