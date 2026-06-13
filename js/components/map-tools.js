/* Component: map-tools — left vertical map toolbar */
NB.mountComponent('nb-map-tools', `
<div class="map-tools glass" data-reveal style="--d:.18s">
  <button class="mtool" data-mtool="zin" data-tip="Zoom in"><svg class="icon"><use href="#i-zoom"/></svg></button>
  <button class="mtool" data-mtool="zout" data-tip="Zoom out"><svg class="icon"><use href="#i-zout"/></svg></button>
  <button class="mtool" data-mtool="fit" data-tip="Fit to area"><svg class="icon"><use href="#i-fit"/></svg></button>
  <div class="mtool-sep"></div>
  <button class="mtool" data-mtool="info" data-tip="Inspect pixel"><svg class="icon"><use href="#i-info"/></svg></button>
  <button class="mtool" data-mtool="measure" data-tip="Measure distance"><svg class="icon"><use href="#i-ruler"/></svg></button>
  <button class="mtool" data-mtool="split" data-tip="Split view" id="mtoolSplit"><svg class="icon"><use href="#i-cols"/></svg></button>
  <div class="mtool-sep"></div>
  <button class="mtool fx" id="vfxBtn" data-tip="Map VFX console (V)"><svg class="icon"><use href="#i-spark"/></svg></button>
</div>
`);
