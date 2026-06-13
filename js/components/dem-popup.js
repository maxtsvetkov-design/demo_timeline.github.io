/* Component: dem-popup — floating DEM layer control panel */
NB.mountComponent('nb-dem-popup', `
<div class="dem-anchor" id="demAnchor">
  <div class="dem-popup glass" id="demPopup">
    <div class="dem-head" id="demHead">
      <span>DEM · Elevation</span>
      <div style="flex:1"></div>
      <button class="ibtn dem-close" id="demClose" data-tip="Close" style="width:24px;height:24px;border-radius:6px">
        <svg class="icon xs"><use href="#i-close"/></svg>
      </button>
    </div>
    <div class="dem-body">
      <label for="opacity">Layer opacity</label>
      <input class="slider" type="range" id="opacity" min="0" max="100" value="100" style="--fill:100%">
      <div class="dem-actions">
        <button class="ibtn" data-act="download" data-tip="Download layer"><svg class="icon sm"><use href="#i-dl"/></svg></button>
        <button class="ibtn" data-act="reset" data-tip="Reset layer"><svg class="icon sm"><use href="#i-rotate"/></svg></button>
        <button class="ibtn" data-act="zoomin" data-tip="Zoom to layer"><svg class="icon sm"><use href="#i-zoom"/></svg></button>
        <button class="ibtn" data-act="elev" data-tip="Elevation profile"><svg class="icon sm"><use href="#i-elev"/></svg></button>
        <button class="ibtn" data-act="split" data-tip="Split / reveal" id="demSplit"><svg class="icon sm"><use href="#i-split"/></svg></button>
        <button class="ibtn" data-act="layers" data-tip="Layer stack"><svg class="icon sm"><use href="#i-layers"/></svg></button>
        <button class="ibtn" data-act="hide" data-tip="Hide layer" id="demHide"><svg class="icon sm"><use id="demHideUse" href="#i-eye-off"/></svg></button>
      </div>
    </div>
  </div>
</div>
`);
