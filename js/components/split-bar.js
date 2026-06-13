/* Component: split-bar — NDVI / satellite reveal divider */
NB.mountComponent('nb-split-bar', `
<div class="split-bar" id="splitBar">
  <div class="split-line"></div>
  <span class="split-tag l">NDVI</span><span class="split-tag r">Satellite</span>
  <button class="split-grip" id="splitGrip" aria-label="Drag to reveal">
    <svg class="icon sm"><use href="#i-grab"/></svg>
  </button>
</div>
`);
