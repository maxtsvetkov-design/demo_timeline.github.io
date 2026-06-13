/* Component: icons — SVG sprite symbols + procedural filter definitions */
NB.mountComponent('nb-icons', `
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="i-chev-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 6 8.5 12l6 6"/></symbol>
<symbol id="i-chev-down" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 9.5 5.5 5.5 5.5-5.5"/></symbol>
<symbol id="i-panel" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="4" y="5" width="16" height="14" rx="2.5"/><path d="M15 5v14"/></symbol>
<symbol id="i-home" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10.8 12 4l8 6.8V19a1.5 1.5 0 0 1-1.5 1.5h-4V15h-5v5.5h-4A1.5 1.5 0 0 1 4 19z"/></symbol>
<symbol id="i-book" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19.2A2.7 2.7 0 0 1 7.7 16.5H19.5V3.5H7.7A2.7 2.7 0 0 0 5 6.2z"/><path d="M5 19.2A2.7 2.7 0 0 0 7.7 21.9H19.5v-5.4"/></symbol>
<symbol id="i-help" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.6"/><path d="M9.6 9.3a2.6 2.6 0 1 1 3.7 2.4c-.8.4-1.3 1-1.3 1.9v.3"/><path d="M12 17h.01" stroke-width="2.4"/></symbol>
<symbol id="i-bell" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 15.5H6.2l1.4-2v-3.7a4.4 4.4 0 0 1 8.8 0v3.7z"/><path d="M10.2 18.6a1.9 1.9 0 0 0 3.6 0"/></symbol>
<symbol id="i-dl" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5v9.5m0 0 3.8-3.8M12 14l-3.8-3.8M5 19.2h14"/></symbol>
<symbol id="i-rotate" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 10A8 8 0 1 1 6 15.3"/><path d="M4.5 5.2V10h4.8"/></symbol>
<symbol id="i-zoom" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="5.7"/><path d="m14.8 14.8 4.4 4.4M10.5 8.2v4.6M8.2 10.5h4.6"/></symbol>
<symbol id="i-zout" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="5.7"/><path d="m14.8 14.8 4.4 4.4M8.2 10.5h4.6"/></symbol>
<symbol id="i-elev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m3.5 17.5 5-7.6 3.7 5.1 2.5-3.5 5.8 6z"/><circle cx="17" cy="6.5" r="1.6"/></symbol>
<symbol id="i-split" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M12 5v14"/></symbol>
<symbol id="i-layers" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.6 20 8l-8 4.4L4 8z"/><path d="m5 11.7 7 3.8 7-3.8"/><path d="m5 15.3 7 3.8 7-3.8"/></symbol>
<symbol id="i-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2.8 12S6.3 6 12 6s9.2 6 9.2 6-3.5 6-9.2 6-9.2-6-9.2-6z"/><circle cx="12" cy="12" r="2.6"/></symbol>
<symbol id="i-eye-off" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m4 4 16 16"/><path d="M10.7 6.3c.4 0 .9-.1 1.3-.1 5.7 0 9.2 5.8 9.2 5.8a15.6 15.6 0 0 1-2.9 3.4M7.2 7.7C4.4 9.4 2.8 12 2.8 12s3.5 5.8 9.2 5.8c1 0 1.9-.2 2.8-.5"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></symbol>
<symbol id="i-fit" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M8.7 4H6a2 2 0 0 0-2 2v2.7M15.3 4H18a2 2 0 0 1 2 2v2.7M20 15.3V18a2 2 0 0 1-2 2h-2.7M4 15.3V18a2 2 0 0 0 2 2h2.7"/></symbol>
<symbol id="i-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 11v5"/><path d="M12 8h.01" stroke-width="2.4"/></symbol>
<symbol id="i-ruler" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17.2 17.2 3 21 6.8 6.8 21z"/><path d="m7.6 16.4 1.5 1.5M10.6 13.4l1.5 1.5M13.6 10.4l1.5 1.5M16.6 7.4l1.5 1.5"/></symbol>
<symbol id="i-cols" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3.5" y="5" width="7.4" height="14" rx="2"/><rect x="13.1" y="5" width="7.4" height="14" rx="2"/></symbol>
<symbol id="i-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/></symbol>
<symbol id="i-link" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.7 14.3a4.4 4.4 0 0 0 6.3.4l2.4-2.4a4.4 4.4 0 0 0-6.2-6.2l-1.2 1.1"/><path d="M14.3 9.7a4.4 4.4 0 0 0-6.3-.4l-2.4 2.4a4.4 4.4 0 0 0 6.2 6.2l1.2-1.1"/></symbol>
<symbol id="i-send" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 10.8 13.2"/><path d="M21 3l-6.5 18-3.7-8.3L2.5 9z"/></symbol>
<symbol id="i-expand" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 3.5h6v6M20.5 3.5 13 11M9.5 20.5h-6v-6M3.5 20.5 11 13"/></symbol>
<symbol id="i-more" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="5.5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18.5" cy="12" r="1.5"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></symbol>
<symbol id="i-play" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8.5 5.4v13.2L19 12z"/></symbol>
<symbol id="i-pause" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M8.5 5.8v12.4M15.5 5.8v12.4"/></symbol>
<symbol id="i-prev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 18 9.8 12l7.7-6z" fill="currentColor" stroke="none"/><path d="M6.5 6v12"/></symbol>
<symbol id="i-next" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 18 14.2 12 6.5 6z" fill="currentColor" stroke="none"/><path d="M17.5 6v12"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M12 5.5v13M5.5 12h13"/></symbol>
<symbol id="i-minus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M5.5 12h13"/></symbol>
<symbol id="i-trend" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3.5 16.5 5.5-5.5 4 4 7.5-8"/><path d="M14.8 7h5.7v5.7"/></symbol>
<symbol id="i-ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3.5"/><path d="M14 4h6v6M20 4l-9 9"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5.5 12.5 4.3 4.3 8.7-9.6"/></symbol>
<symbol id="i-grab" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m9.5 8.5-3.5 3.5 3.5 3.5M14.5 8.5l3.5 3.5-3.5 3.5"/></symbol>
<symbol id="i-spark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.5 12.6 9l4.5 1.6-4.5 1.6L11 16.7l-1.6-4.5L4.9 10.6 9.4 9z"/><path d="M18.5 4v3M17 5.5h3M17.8 16.5v2.6M16.5 17.8h2.6"/></symbol>
<symbol id="i-bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3 5.5 13.5h5L10.5 21 18.5 10.5h-5z"/></symbol>
<symbol id="i-cloud" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7.2 17.5h9.3a3.6 3.6 0 0 0 .7-7.13A5.3 5.3 0 0 0 7 9.6a4 4 0 0 0 .2 7.9z"/></symbol>
<symbol id="i-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"/><path d="M16.6 7.4a6.5 6.5 0 0 1 0 9.2M7.4 16.6a6.5 6.5 0 0 1 0-9.2"/><path d="M19.2 4.8a10.2 10.2 0 0 1 0 14.4M4.8 19.2a10.2 10.2 0 0 1 0-14.4" opacity=".45"/></symbol>
<symbol id="i-gridfx" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 9h16M4 15h16M9 4v16M15 4v16"/></symbol>
<symbol id="i-wavefx" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 14.5c2.4-4.8 4.8-4.8 6.8 0s4.4 4.8 6.8 0 2.2-2.4 4.4-1"/><path d="M3 9c2.4-4 4.8-4 6.8 0s4.4 4 6.8 0" opacity=".5"/></symbol>
<symbol id="i-grainfx" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="6" cy="6" r="1.2"/><circle cx="12" cy="7" r="1.2"/><circle cx="18" cy="6" r="1.2"/><circle cx="7" cy="12" r="1.2"/><circle cx="13" cy="12" r="1.2"/><circle cx="18" cy="13" r="1.2"/><circle cx="6" cy="18" r="1.2"/><circle cx="12" cy="17" r="1.2"/><circle cx="18" cy="18" r="1.2"/></symbol>
<symbol id="i-scanfx" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="14" rx="2.5"/><path d="M9.5 5v14"/><path d="m12.5 9 3 3-3 3"/></symbol>
</defs></svg>

<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="gSea" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#d6e6e1"/><stop offset=".28" stop-color="#5fb9ac"/>
    <stop offset=".62" stop-color="#1f7f7c"/><stop offset="1" stop-color="#0d3a3e"/>
  </linearGradient>
  <filter id="fSea" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.0026 0.0043" numOctaves="5" seed="2"/>
    <feColorMatrix type="matrix" values="0 0 1 0 0  0 0 1 0 0  0 0 1 0 0  0 0 0 0 1"/>
    <feComponentTransfer>
      <feFuncR type="table" tableValues="0.03 0.06 0.10 0.17 0.46 0.86 0.94"/>
      <feFuncG type="table" tableValues="0.15 0.29 0.46 0.64 0.80 0.89 0.88"/>
      <feFuncB type="table" tableValues="0.19 0.32 0.47 0.62 0.75 0.81 0.75"/>
    </feComponentTransfer>
  </filter>
  <filter id="fSeaDetail" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.011 0.018" numOctaves="3" seed="9"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.02  0 0 0 0 0.10  0 0 0 0 0.10  0 0 0.9 0 0"/>
  </filter>
  <filter id="fDemA" x="-8%" y="-8%" width="116%" height="116%">
    <feTurbulence type="fractalNoise" baseFrequency="0.02 0.028" numOctaves="5" seed="3" result="noise"/>
    <feColorMatrix in="noise" type="matrix" values="0 0 1 0 0  0 0 1 0 0  0 0 1 0 0  0 0 0 0 1" result="g"/>
    <feComponentTransfer in="g" result="ramp">
      <feFuncR type="table" tableValues="0.14 0.20 0.45 0.85 0.97 0.95"/>
      <feFuncG type="table" tableValues="0.30 0.55 0.78 0.91 0.92 0.80"/>
      <feFuncB type="table" tableValues="0.60 0.48 0.32 0.26 0.20 0.14"/>
    </feComponentTransfer>
    <feDiffuseLighting in="noise" surfaceScale="4" diffuseConstant="1" lighting-color="#fff" result="lit">
      <feDistantLight azimuth="235" elevation="58"/></feDiffuseLighting>
    <feColorMatrix in="lit" type="matrix" values="0.85 0 0 0 0.13 0 0.85 0 0 0.13 0 0 0.85 0 0.13 0 0 0 0 1" result="lit2"/>
    <feComposite in="ramp" in2="lit2" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="sh"/>
    <feComposite in="sh" in2="SourceGraphic" operator="in"/>
  </filter>
  <filter id="fDemB" x="-8%" y="-8%" width="116%" height="116%">
    <feTurbulence type="fractalNoise" baseFrequency="0.02 0.028" numOctaves="5" seed="12" result="noise"/>
    <feColorMatrix in="noise" type="matrix" values="0 0 1 0 0  0 0 1 0 0  0 0 1 0 0  0 0 0 0 1" result="g"/>
    <feComponentTransfer in="g" result="ramp">
      <feFuncR type="table" tableValues="0.08 0.12 0.25 0.62 0.93 0.97"/>
      <feFuncG type="table" tableValues="0.26 0.48 0.76 0.90 0.94 0.88"/>
      <feFuncB type="table" tableValues="0.62 0.55 0.38 0.28 0.22 0.16"/>
    </feComponentTransfer>
    <feDiffuseLighting in="noise" surfaceScale="4" diffuseConstant="1" lighting-color="#fff" result="lit">
      <feDistantLight azimuth="235" elevation="58"/></feDiffuseLighting>
    <feColorMatrix in="lit" type="matrix" values="0.85 0 0 0 0.13 0 0.85 0 0 0.13 0 0 0.85 0 0.13 0 0 0 0 1" result="lit2"/>
    <feComposite in="ramp" in2="lit2" operator="arithmetic" k1="1" k2="0" k3="0" k4="0" result="sh"/>
    <feComposite in="sh" in2="SourceGraphic" operator="in"/>
  </filter>
</defs></svg>
`);
