/* Component: minimap — mini overview map button */
NB.mountComponent('nb-minimap', `
<button class="minimap" id="minimap" aria-label="Mini-map overview" data-reveal style="--d:.3s">
  <svg viewBox="0 0 118 96">
    <rect width="118" height="96" fill="#0a2530"/>
    <path d="M-10 60 C20 35 45 70 75 48 C95 35 112 50 128 40 L128 110 L-10 110 Z" fill="#123e3c"/>
    <path d="M-10 18 C25 5 60 28 90 12 L128 5 L128 -10 L-10 -10 Z" fill="#0d2f36"/>
    <ellipse cx="38" cy="42" rx="16" ry="8" fill="#1b5a51" opacity=".8"/>
    <rect x="62" y="36" width="26" height="18" rx="2" fill="none" stroke="#cfe8df" stroke-width="1.4"/>
    <path d="M66 50 L78 41" stroke="#ff8a3d" stroke-width="2" stroke-linecap="round"/>
    <rect class="mm-scan" x="-30" y="0" width="22" height="96" fill="rgba(60,232,166,.12)"/>
  </svg>
</button>
`);
