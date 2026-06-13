/* ── Component: camera-3d — GIS compass (fully isolated) ─────────────────
   All markup · styles · logic in one IIFE. Mount-point: #nb-camera-3d
   ─────────────────────────────────────────────────────────────────────── */
(function(){
  'use strict';

  /* ── 1. Styles ─────────────────────────────────────────────────────── */
  if(!document.getElementById('nb-camera-3d-style')){
    const s=document.createElement('style');
    s.id='nb-camera-3d-style';
    s.textContent=`
      /* wrapper — ghost when north-up+flat, solid when rotated or hovered */
      .m3d-wrap{
        position:absolute;
        right:calc(var(--story-w,472px) + 24px);
        top:86px;
        z-index:470;
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:6px;
        pointer-events:auto;
        opacity:.28;
        transition:opacity .4s ease;
      }
      .m3d-wrap.m3d-active{ opacity:1; }
      .m3d-wrap:hover,
      .m3d-wrap:focus-within{ opacity:1 !important; }

      /* ambient glow halo */
      .m3d-compass::before{
        content:"";position:absolute;inset:-10px;border-radius:50%;
        background:rgba(240,236,226,.48);filter:blur(8px);
        z-index:-1;pointer-events:none;
      }

      /* ring container */
      .m3d-compass{
        position:relative;width:64px;height:64px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        user-select:none;touch-action:none;outline:none;cursor:grab;
      }
      .m3d-compass:active{ cursor:grabbing; }
      .m3d-compass:focus-visible{
        outline:2px solid rgba(41,170,255,.8);outline-offset:3px;
      }

      /* pitch arc (SVG overlay, fixed — shows tilt angle 0–72°) */
      .m3d-pitch-svg{
        position:absolute;inset:-5px;
        width:calc(100% + 10px);height:calc(100% + 10px);
        pointer-events:none;z-index:6;overflow:visible;
      }
      .m3d-pitch-track{ fill:none;stroke:rgba(120,120,120,.13);stroke-width:2; }
      .m3d-pitch-fill{
        fill:none;stroke:rgba(51,180,255,.72);stroke-width:2.5;stroke-linecap:round;
        transition:stroke-dasharray .12s linear;
      }
      @media(prefers-reduced-motion:reduce){ .m3d-pitch-fill{ transition:none; } }

      /* rotating ring */
      .m3d-wheel{
        position:absolute;inset:0;border-radius:50%;
        background:radial-gradient(circle,
          transparent 0%,transparent 68%,
          rgba(255,255,255,.92) 68%,rgba(255,255,255,.92) 100%);
        border:1.5px solid rgba(200,200,200,.36);
        box-shadow:
          0 0 0 1px rgba(0,0,0,.07),
          0 2px 10px rgba(0,0,0,.14),
          inset 0 1px 2px rgba(255,255,255,.7),
          inset 0 -1px 2px rgba(0,0,0,.06);
        transform:rotate(var(--bearing-rot,0deg));
        transform-origin:center;will-change:transform;
        transition:transform .08s linear;pointer-events:none;z-index:2;
      }
      /* suppress transitions during drag for pixel-perfect tracking */
      .m3d-wrap.m3d-dragging .m3d-wheel,
      .m3d-wrap.m3d-dragging .m3d-core-arrow{ transition:none; }
      @media(prefers-reduced-motion:reduce){
        .m3d-wheel{ transition:none; }
        .m3d-core-arrow{ transition:none; }
      }
      .m3d-ticks{ position:absolute;inset:0;width:100%;height:100%;pointer-events:none; }

      /* E/S/W cardinal dots on wheel (rotate with it) */
      .m3d-cdot{
        position:absolute;width:5px;height:5px;border-radius:50%;
        background:rgba(130,130,130,.65);pointer-events:none;z-index:3;
      }
      .m3d-cdot.e{ right:3px;top:50%;transform:translateY(-50%); }
      .m3d-cdot.s{ bottom:3px;left:50%;transform:translateX(-50%); }
      .m3d-cdot.w{ left:3px;top:50%;transform:translateY(-50%); }

      /* N marker — FIXED outside the wheel, always at top = always north */
      .m3d-north-dot{
        position:absolute;top:2px;left:50%;
        width:7px;height:7px;border-radius:50%;
        background:#e8402a;box-shadow:0 0 5px rgba(232,64,42,.52);
        transform:translateX(-50%);z-index:5;pointer-events:none;
      }

      /* cardinal snap buttons (N / E / S / W) */
      .m3d-hit{
        position:absolute;z-index:4;border:none;background:transparent;
        padding:0;cursor:pointer;border-radius:3px;transition:background .1s;
      }
      .m3d-hit:hover{ background:rgba(255,255,255,.28); }
      .m3d-hit-n,.m3d-hit-s{ left:50%;transform:translateX(-50%);width:20px;height:14px; }
      .m3d-hit-n{ top:0; } .m3d-hit-s{ bottom:0; }
      .m3d-hit-w,.m3d-hit-e{ top:50%;transform:translateY(-50%);width:14px;height:20px; }
      .m3d-hit-w{ left:0; } .m3d-hit-e{ right:0; }

      /* center toggle button — positioned via flex on parent, transform free for effects */
      .m3d-core{
        position:absolute;
        left:50%;top:50%;
        translate:-50% -50%;          /* separate from transform → never conflicts */
        width:36px;height:36px;
        border-radius:50%;border:1px solid rgba(0,0,0,.08);
        background:
          radial-gradient(circle at 36% 30%,rgba(255,255,255,.88) 0%,rgba(255,255,255,.18) 52%,transparent 100%),
          linear-gradient(165deg,#f4f1ea 0%,#e0dbd2 45%,#cac4b8 100%);
        box-shadow:
          0 2px 6px rgba(0,0,0,.2),0 .5px 2px rgba(0,0,0,.1),
          inset 0 1.5px 2px rgba(255,255,255,.9),inset 0 -1.5px 3px rgba(0,0,0,.1);
        display:flex;align-items:center;justify-content:center;
        cursor:pointer;z-index:5;
        transition:box-shadow .15s,background .22s,scale .1s;
      }
      .m3d-core:hover{ box-shadow:0 3px 8px rgba(0,0,0,.24),inset 0 1.5px 2px rgba(255,255,255,.9); }
      .m3d-core:active{ scale:.93; }   /* scale is its own property — position unaffected */
      .m3d-core.is-3d{
        background:
          radial-gradient(circle at 36% 30%,rgba(255,255,255,.72) 0%,rgba(255,255,255,.1) 52%,transparent 100%),
          linear-gradient(165deg,#4a9fd8 0%,#2272b6 55%,#1356a0 100%);
        box-shadow:0 0 0 2px rgba(41,170,255,.35),0 3px 8px rgba(0,0,0,.28),
          inset 0 1.5px 2px rgba(255,255,255,.6);
      }
      .m3d-core span{
        font-family:SF Pro Display,SF Pro Text,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
        font-size:11px;font-weight:700;letter-spacing:.4px;user-select:none;
        color:rgba(60,60,60,.85);transition:color .18s;
        pointer-events:none;
      }
      .m3d-core.is-3d span{ color:#fff; }

      /* drag handle — removed */
      .m3d-drag-btn{display:none}

      /* bearing + pitch readout below compass */
      .m3d-readout{
        display:flex;gap:4px;align-items:center;justify-content:center;
        opacity:0;transform:translateY(-4px);
        transition:opacity .22s,transform .22s;
        pointer-events:none;white-space:nowrap;
      }
      /* dimly visible when rotated (active), full opacity on hover */
      .m3d-wrap.m3d-active .m3d-readout{ opacity:.55;transform:translateY(0); }
      .m3d-wrap:hover .m3d-readout,
      .m3d-wrap:focus-within .m3d-readout{ opacity:1;transform:translateY(0); }
      .m3d-readout span{
        font-family:SF Mono,ui-monospace,'JetBrains Mono',monospace;
        font-size:9px;font-weight:500;
        color:rgba(255,255,255,.9);background:rgba(0,0,0,.48);
        backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
        padding:2px 5px;border-radius:4px;letter-spacing:.4px;
      }
      /* pitch label only shown when actually tilted */
      .m3d-pitch-ro{ display:none; }
      .m3d-wrap.m3d-pitched .m3d-pitch-ro{ display:inline; }

      /* ── pitch slider (vertical, left of compass) ── */
      .m3d-pitch-wrap{
        position:absolute;
        right:calc(100% + 12px);
        top:0;
        height:64px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:space-between;
        gap:3px;
        opacity:0;
        transition:opacity .3s;
        pointer-events:none;
      }
      .m3d-wrap:hover .m3d-pitch-wrap,
      .m3d-wrap:focus-within .m3d-pitch-wrap,
      .m3d-wrap.m3d-pitched .m3d-pitch-wrap,
      .m3d-wrap.m3d-active .m3d-pitch-wrap{
        opacity:1;
        pointer-events:auto;
      }
      .m3d-pitch-lbl-t,.m3d-pitch-lbl-b{
        font-size:8px;font-family:SF Mono,ui-monospace,monospace;
        color:rgba(255,255,255,.6);background:rgba(0,0,0,.42);
        backdrop-filter:blur(4px);padding:1px 4px;border-radius:3px;
        letter-spacing:.3px;line-height:1.3;
      }
      .m3d-pitch-slider{
        writing-mode:vertical-lr;
        direction:rtl;
        -webkit-appearance:slider-vertical;
        appearance:slider-vertical;
        width:18px;
        height:46px;
        cursor:ns-resize;
        outline:none;
        accent-color:rgb(51,180,255);
        flex-shrink:0;
      }

      /* responsive */
      @media(max-width:1500px){
        .m3d-wrap{ right:calc(var(--story-w,472px) + 18px);top:92px; }
        .m3d-compass{ width:60px;height:60px; }
        .m3d-core{ width:32px;height:32px; }
        .m3d-core-arrow{ width:12px;height:12px; }
      }
      @media(max-width:1280px){
        .m3d-wrap{ right:calc(var(--story-w,472px) + 14px);top:96px; }
        .m3d-compass{ width:56px;height:56px; }
        .m3d-core{ width:28px;height:28px; }
        .m3d-core-arrow{ width:10px;height:10px; }
      }
    `;
    document.head.appendChild(s);
  }

  /* ── 2. Template ───────────────────────────────────────────────────── */
  NB.mountComponent('nb-camera-3d',`
  <aside class="m3d-wrap" id="map3dController">
    <!-- Pitch slider — vertical, floats left of compass ring -->
    <div class="m3d-pitch-wrap" id="map3dPitchWrap">
      <span class="m3d-pitch-lbl-t">72°</span>
      <input class="m3d-pitch-slider" id="map3dPitchSlider"
             type="range" min="0" max="72" step="1" value="0"
             aria-label="Map pitch 0–72°" aria-valuenow="0">
      <span class="m3d-pitch-lbl-b">0°</span>
    </div>
    <div class="m3d-compass" id="map3dRing"
         tabindex="0" role="slider"
         aria-label="Compass. Bearing 0°. Pitch 0°."
         aria-valuemin="0" aria-valuemax="360" aria-valuenow="0">

      <!-- Pitch arc (r=34, circ≈213.6, dashoffset=160.2 → starts at 12 o'clock) -->
      <svg class="m3d-pitch-svg" viewBox="0 0 74 74" aria-hidden="true">
        <circle class="m3d-pitch-track" cx="37" cy="37" r="34"/>
        <circle class="m3d-pitch-fill" id="map3dPitchArc" cx="37" cy="37" r="34"
                stroke-dasharray="0 213.6" stroke-dashoffset="160.2"/>
      </svg>

      <!-- Rotating ring (E/S/W dots rotate with it; N is outside) -->
      <div class="m3d-wheel" id="map3dWheel" aria-hidden="true">
        <svg class="m3d-ticks" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="29" fill="none"
                  stroke="rgba(100,100,100,.4)" stroke-width="1.4"
                  stroke-dasharray="2.2 4.5" stroke-linecap="round"/>
          <circle cx="32" cy="32" r="24" fill="none"
                  stroke="rgba(150,150,150,.2)" stroke-width=".7"
                  stroke-dasharray="1.2 6" stroke-linecap="round"/>
        </svg>
        <span class="m3d-cdot e" aria-hidden="true"></span>
        <span class="m3d-cdot s" aria-hidden="true"></span>
        <span class="m3d-cdot w" aria-hidden="true"></span>
      </div>

      <!-- N marker: FIXED at top, never rotates — always points north -->
      <span class="m3d-north-dot" aria-hidden="true"></span>

      <!-- Cardinal snap buttons -->
      <button class="m3d-hit m3d-hit-n" id="map3dNorth" aria-label="Face north (0°)"></button>
      <button class="m3d-hit m3d-hit-e" id="map3dEast"  aria-label="Face east (90°)"></button>
      <button class="m3d-hit m3d-hit-s" id="map3dSouth" aria-label="Face south (180°)"></button>
      <button class="m3d-hit m3d-hit-w" id="map3dWest"  aria-label="Face west (270°)"></button>

      <!-- Center toggle button: starts in 2D state -->
      <button class="m3d-core" id="osmIsoBtn"
              aria-label="Switch to 3D view" title="Toggle 2D / 3D view">
        <span>2D</span>
      </button>

      <!-- Drag handle removed — compass is fixed position -->
    </div>

    <!-- Bearing readout (dimly visible when rotated, bright on hover) -->
    <!-- Pitch readout only appears when map is tilted -->
    <div class="m3d-readout" id="map3dReadout" aria-live="polite" aria-atomic="true">
      <span id="map3dBearingVal">000°</span>
      <span class="m3d-pitch-ro" id="map3dPitchVal">↕0°</span>
    </div>
  </aside>
  `);

  /* ── 3. Logic ──────────────────────────────────────────────────────── */
  (function initCompass(){
    const panel   =document.getElementById('map3dController');
    const ring    =document.getElementById('map3dRing');
    const wheel   =document.getElementById('map3dWheel');
    const core    =document.getElementById('osmIsoBtn');
    const btnNorth=document.getElementById('map3dNorth');
    const btnEast =document.getElementById('map3dEast');
    const btnSouth=document.getElementById('map3dSouth');
    const btnWest =document.getElementById('map3dWest');
    const pitchArc=document.getElementById('map3dPitchArc');
    const bearLbl =document.getElementById('map3dBearingVal');
    const pitchLbl   =document.getElementById('map3dPitchVal');
    const pitchSlider =document.getElementById('map3dPitchSlider');
    const stage       =document.getElementById('stage');
    if(!panel||!ring||!core||!btnNorth||!stage)return;

    /* pitch arc: r=34, circumference = 2π*34 ≈ 213.628
       dashoffset = circ*0.75 ≈ 160.2 → arc origin at 12 o'clock        */
    const CIRC=2*Math.PI*34;
    const PMAX=72;

    const cam=()=>(NB.map&&NB.map.cam)||{pitch:0,bearing:0};

    const setCamera=(pitch,bearing,animate=true)=>{
      if(NB.map&&typeof NB.map.setCamera==='function')
        NB.map.setCamera(pitch,bearing,animate);
    };

    /* ── sync: redraw every element from NB.map.cam ─────────────────── */
    const sync=()=>{
      if(!NB.map)return;
      const {pitch:rawP,bearing:rawB}=cam();
      const bearing=Number(rawB)||0;
      const pitch  =NB.clamp(Number(rawP)||0,0,PMAX);
      const bNorm  =((Math.round(bearing)%360)+360)%360;

      /* 1 — wheel rotates opposite to map bearing so N always faces up on screen */
      wheel.style.setProperty('--bearing-rot',(-bearing).toFixed(2)+'deg');
      /* needle in core counter-rotates with map so it always points to map-north */
      ring.style.setProperty('--bearing-rot',(-bearing).toFixed(2)+'deg');

      /* 2 — bearing readout */
      if(bearLbl)bearLbl.textContent=String(bNorm).padStart(3,'0')+'°';

      /* 3 — pitch arc (max arc = quarter circle at PMAX) */
      if(pitchArc){
        const arc=(pitch/PMAX)*(CIRC*0.25);
        pitchArc.setAttribute('stroke-dasharray',arc.toFixed(2)+' '+CIRC.toFixed(2));
      }
      if(pitchLbl)pitchLbl.textContent='↕'+Math.round(pitch)+'°';
      panel.classList.toggle('m3d-pitched',pitch>1);

      /* 4 — pitch slider (don't fight the user while they drag it) */
      if(pitchSlider&&document.activeElement!==pitchSlider)
        pitchSlider.value=Math.round(pitch);

      /* 5 — 2D/3D button mirrors real map pitch */
      const actually3D=pitch>5;
      core.classList.toggle('is-3d',actually3D);
      if(coreLabel)coreLabel.textContent=actually3D?'3D':'2D';
      core.setAttribute('aria-label',actually3D?'Switch to 2D view':'Switch to 3D view');

      /* 6 — auto-fade: ghost only when north AND flat */
      panel.classList.toggle('m3d-active',bNorm>1||pitch>1);

      /* 7 — aria */
      ring.setAttribute('aria-label','Compass. Bearing '+bNorm+'°. Pitch '+Math.round(pitch)+'°.');
      ring.setAttribute('aria-valuenow',bNorm);
    };

    /* ── Cardinal snap buttons (bearing only, pitch always 0) ────────── */
    btnNorth.addEventListener('click',()=>setCamera(0,  0));
    btnEast .addEventListener('click',()=>setCamera(0, 90));
    btnSouth.addEventListener('click',()=>setCamera(0,180));
    btnWest .addEventListener('click',()=>setCamera(0,270));

    /* ── Core: toggle 2D / 3D via CSS custom property ──────────────── */
    let is3D=false;  /* starts 2D — matches flat initial map state */
    const coreLabel=core.querySelector('span');
    const mapEl=document.getElementById('stageMap');

    core.addEventListener('click',()=>{
      /* read current pitch from MapLibre, toggle 0 ↔ 45 */
      const currentlyFlat=(cam().pitch||0)<5;
      setCamera(currentlyFlat?45:0, cam().bearing, true);
      NB.toast&&NB.toast(currentlyFlat?'3D perspective':'2D flat');
    });

    /* ── Ring drag: rotational (angle from center) ────────────────────── */
    let orb=false,startAngle=0,sb=0;
    const ringAngle=e=>{
      const r=ring.getBoundingClientRect();
      const cx=r.left+r.width/2, cy=r.top+r.height/2;
      return Math.atan2(e.clientY-cy, e.clientX-cx)*180/Math.PI;
    };
    ring.addEventListener('pointerdown',e=>{
      if(e.target.closest&&e.target.closest('button'))return;
      if(!NB.map||!NB.map.cam)return;
      orb=true;
      startAngle=ringAngle(e);
      sb=cam().bearing;
      panel.classList.add('m3d-dragging');
      ring.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    ring.addEventListener('pointermove',e=>{
      if(!orb)return;
      const delta=ringAngle(e)-startAngle;
      setCamera(0,sb+delta,false);
    });
    const endOrb=e=>{
      if(!orb)return;orb=false;
      panel.classList.remove('m3d-dragging');
      if(e&&e.pointerId!=null&&ring.hasPointerCapture&&ring.hasPointerCapture(e.pointerId))
        ring.releasePointerCapture(e.pointerId);
    };
    ring.addEventListener('pointerup',endOrb);
    ring.addEventListener('pointercancel',endOrb);

    /* ── Scroll: 3° bearing per tick ─────────────────────────────── */
    ring.addEventListener('wheel',e=>{
      e.preventDefault();
      setCamera(0,cam().bearing+Math.sign(e.deltaY)*3,false);
    },{passive:false});

    /* ── Keyboard: ←/→ bearing ±5°, Enter reset ──────────────────────── */
    ring.addEventListener('keydown',e=>{
      if(!NB.map||!NB.map.cam)return;
      const{bearing}=cam();
      let ok=true;
      switch(e.key){
        case'ArrowLeft':  setCamera(0,bearing-5);break;
        case'ArrowRight': setCamera(0,bearing+5);break;
        case'Enter': setCamera(0,0);NB.toast&&NB.toast('Map facing north');break;
        default: ok=false;
      }
      if(ok)e.preventDefault();
    });

    /* ── Pitch slider ───────────────────────────────────────────────── */
    if(pitchSlider){
      pitchSlider.addEventListener('input',()=>{
        setCamera(Number(pitchSlider.value),cam().bearing,false);
      });
    }

    /* ── Bus ────────────────────────────────────────────────────────── */
    NB.bus&&NB.bus.on('map:moved',sync);

    /* ── Wait for NB.map, then initial sync ─────────────────────────── */
    const wait=()=>{
      if(!NB.map||typeof NB.map.setCamera!=='function'){requestAnimationFrame(wait);return;}
      sync();
    };
    wait();
  })();
})();

