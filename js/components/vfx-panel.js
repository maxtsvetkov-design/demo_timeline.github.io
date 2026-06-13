/* Component: vfx-panel — map VFX controls with effect rows */
NB.mountComponent('nb-vfx-panel', `
<aside class="vfx-panel glass" id="vfxPanel" aria-label="Map VFX controls">
  <div class="fx-head">
    <h3>MAP VFX</h3><span class="live"><i></i>LIVE</span><div class="gap"></div>
    <button class="pico" id="fxClose" data-tip="Close"><svg class="icon sm"><use href="#i-close"/></svg></button>
  </div>
  <div class="fx-presets">
    <button class="fx-preset" data-fxpreset="off">Off</button>
    <button class="fx-preset" data-fxpreset="calm">Calm</button>
    <button class="fx-preset active" data-fxpreset="cine">Cine</button>
    <button class="fx-preset" data-fxpreset="max">Max</button>
  </div>
  <div class="fx-master">
    <svg class="icon sm" style="color:var(--mint)"><use href="#i-spark"/></svg>
    <b>Master effects</b>
    <button class="sw-toggle on" id="fxMaster" role="switch" aria-checked="true" aria-label="Master effects"></button>
  </div>
  <div class="fx-global">
    <div><label>INTENSITY</label><input class="slider" type="range" id="fxIntensity" min="0" max="100" value="80" style="--fill:80%"></div>
    <div><label>SPEED</label><input class="slider" type="range" id="fxSpeed" min="25" max="200" value="100" style="--fill:43%"></div>
  </div>
  <div class="fx-rows">
    <div class="fx-row" data-fx="pulses">
      <span class="fxi"><svg class="icon sm"><use href="#i-pulse"/></svg></span>
      <span class="fxn"><b>Sonar pulses</b><small>fires on keyframe hits</small></span>
      <button class="sw-toggle on" data-fxsw="pulses" role="switch" aria-checked="true"></button>
    </div>
    <div class="fx-row" data-fx="clouds">
      <span class="fxi"><svg class="icon sm"><use href="#i-cloud"/></svg></span>
      <span class="fxn"><b>Cloud shadows</b><small>drifting cover</small></span>
      <button class="sw-toggle on" data-fxsw="clouds" role="switch" aria-checked="true"></button>
    </div>
    <div class="fx-row" data-fx="aurora">
      <span class="fxi"><svg class="icon sm"><use href="#i-wavefx"/></svg></span>
      <span class="fxn"><b>Aurora wash</b><small>spectral colour field</small></span>
      <button class="sw-toggle on" data-fxsw="aurora" role="switch" aria-checked="true"></button>
    </div>
  </div>
  <div class="fx-foot">
    <span>FPS <b id="fxFps">--</b></span>
    <div class="gap"></div>
    <span id="fxTune">AUTO-TUNE ON</span>
  </div>
</aside>
`);
