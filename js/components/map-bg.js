/* Component: map-bg — procedural sea, atmosphere layers, VFX canvas */
NB.mountComponent('nb-map-bg', `
<div class="sea" id="sea">
  <svg viewBox="0 0 1440 1100" preserveAspectRatio="xMidYMid slice">
    <rect width="1440" height="1100" fill="url(#gSea)"/>
    <rect width="1440" height="1100" filter="url(#fSea)" opacity=".38"/>
    <rect width="1440" height="1100" filter="url(#fSeaDetail)" opacity=".2"/>
  </svg>
</div>
<div class="ambient a1"></div>
<div class="ambient a2"></div>
<div class="aurora" aria-hidden="true"><i></i><i></i></div>
<div class="ray r1"></div>
<div class="ray r2"></div>
<div class="haze"></div>
<canvas id="vfxCanvas" aria-hidden="true"></canvas>
<div class="vignette"></div>
<div class="grain" aria-hidden="true"></div>
`);
