/* Component: timeline — timeline section with layer rows, tracks, and controls */
NB.mountComponent('nb-timeline', `
<section class="timeline glass" aria-label="Timeline" data-reveal style="--d:.26s">
  <div class="tl-resize-top"  id="tlResizeTop"   aria-hidden="true"></div>
  <div class="tl-resize-right" id="tlResizeRight" aria-hidden="true"></div>
  <div class="tl-top">
    <div style="position:relative">
      <button class="btn-green" id="addLayers">
        <svg class="icon sm"><use href="#i-layers"/></svg>Add Layers
      </button>
      <div class="lm-panel glass" id="layersMenu" role="dialog" aria-label="Layer selector">
        <div class="lm-head">
          <svg class="icon xs lm-head-ico"><use href="#i-layers"/></svg>
          <span class="lm-title">Layers</span>
          <span class="lm-badge" id="lmBadge">3 / 17</span>
          <button class="lm-x" id="lmClose" aria-label="Close"><svg class="icon xs"><use href="#i-close"/></svg></button>
        </div>
        <div class="lm-search-row">
          <svg class="icon xs lm-search-ico"><use href="#i-zoom"/></svg>
          <input class="lm-search" id="lmSearch" type="search" placeholder="Search layers…" autocomplete="off" spellcheck="false">
          <button class="lm-clear-q" id="lmClearQ" aria-label="Clear" tabindex="-1"><svg class="icon xs"><use href="#i-close"/></svg></button>
        </div>
        <div class="lm-toolbar">
          <button class="lm-tbtn" id="lmSelAll">Select all</button>
          <button class="lm-tbtn" id="lmDesel">Clear extras</button>
          <button class="lm-tbtn lm-tbtn-r" id="lmReset"><svg class="icon xs"><use href="#i-rotate"/></svg>Reset</button>
        </div>
        <div class="lm-empty" id="lmEmpty">No layers match</div>
        <div class="lm-list" id="lmList" role="listbox" aria-multiselectable="true">
          <div class="lm-group-hd">Map data</div>
          <div class="lm-item on lm-core" role="option" aria-selected="true" data-layer="dem" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw ndvi"></span>
            <span class="lm-lbl">DEM<small>Digital Elevation Model</small></span>
            <span class="lm-pin">core</span>
          </div>
          <div class="lm-item on lm-core" role="option" aria-selected="true" data-layer="basemap" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw base"></span>
            <span class="lm-lbl">Basemap<small>14 May 2025</small></span>
            <span class="lm-pin">core</span>
          </div>
          <div class="lm-item on lm-core" role="option" aria-selected="true" data-layer="osm" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw osm"></span>
            <span class="lm-lbl">OpenStreetMap<small>Live OSM tiles</small></span>
            <span class="lm-pin">core</span>
          </div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="moisture" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw moisture"></span>
            <span class="lm-lbl">Soil moisture<small>SAR composite</small></span>
          </div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="canopy" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw canopy"></span>
            <span class="lm-lbl">Canopy height<small>Photogrammetry</small></span>
          </div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="tidal" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw tidal"></span>
            <span class="lm-lbl">Tidal extent<small>Hydrology model</small></span>
          </div>
          <div class="lm-group-hd">Story panel</div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="liwa-meta" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw liwa-meta"></span>
            <span class="lm-lbl">Liwa area info<small>Site metadata</small></span>
          </div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="liwa-classif" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw liwa-classif"></span>
            <span class="lm-lbl">Area classification insights<small>Land cover · Jan 2024</small></span>
          </div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="liwa-fauna" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw liwa-fauna"></span>
            <span class="lm-lbl">Native fauna survey<small>Field observations</small></span>
          </div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="liwa-impact" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw liwa-impact"></span>
            <span class="lm-lbl">Impact classification<small>Ground survey</small></span>
          </div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="mgr-flow" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw mgr-flow"></span>
            <span class="lm-lbl">Mangrove survival flow<small>Sankey · propagule → canopy</small></span>
          </div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="area-time" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw area-time"></span>
            <span class="lm-lbl">Area classification over time<small>Satellite 10 m</small></span>
          </div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="habitat" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw habitat"></span>
            <span class="lm-lbl">Habitat health index<small>Composite score</small></span>
          </div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="data-upd" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw data-upd"></span>
            <span class="lm-lbl">Data update per project<small>Survey events</small></span>
          </div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="biomass" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw biomass"></span>
            <span class="lm-lbl">Total biomass growth<small>Above-ground · t/ha</small></span>
          </div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="veg-cover" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw veg-cover"></span>
            <span class="lm-lbl">Vegetation &amp; cover<small>NDVI + land cover</small></span>
          </div>
          <div class="lm-item" role="option" aria-selected="false" data-layer="dem-cmp" tabindex="0">
            <span class="lm-cb"><svg class="icon xs lm-chk"><use href="#i-check"/></svg></span>
            <span class="sw dem-cmp"></span>
            <span class="lm-lbl">Elevation model comparison<small>DEM A vs DEM B</small></span>
          </div>
        </div>
      </div>
    </div>
    <button class="chip outline" id="resetBtn">Reset</button>
    <button class="chip" data-range="1H">1H</button>
    <button class="chip" data-range="6H">6H</button>
    <button class="chip active" data-range="24H">24H</button>
    <button class="chip" data-range="7D">7D</button>
    <button class="chip" data-range="30D">30D</button>
    <button class="chip" data-range="YTD">YTD</button>
    <button class="chip" data-range="Custom">Custom</button>
    <div class="gap"></div>
    <button class="chip outline" id="panBtn">Pan</button>
    <button class="round-ic" id="tlMinus" data-tip="Zoom out timeline">
      <svg class="icon sm"><use href="#i-minus"/></svg>
    </button>
    <button class="round-ic" id="tlPlus" data-tip="Zoom in timeline">
      <svg class="icon sm"><use href="#i-plus"/></svg>
    </button>
  </div>

  <div class="tl-grid">
    <div class="tl-labels" id="tlLabels">
      <div class="layer-row" data-layer="dem" draggable="true">
        <span class="layer-drag-handle" data-tip="Drag to reorder"><svg class="icon sm"><use href="#i-grab"/></svg></span>
        <button class="eye-t" data-tip="Collapse row"><svg class="icon xs"><use href="#i-chev-down"/></svg></button>
        <span class="sw ndvi"></span>
        <span class="lname">DEM <svg class="icon xs info-i" data-info="Digital Elevation Model for terrain analysis."><use href="#i-info"/></svg></span>
        <div class="layer-opacity-wrap">
          <input class="layer-opacity" type="range" min="0" max="100" value="100" data-layer-opacity="dem" style="--layer-opacity:100%" aria-label="DEM opacity">
        </div>
        <button class="eye-t on" id="eyeNdvi" data-tip="Toggle visibility"><svg class="icon sm"><use id="eyeNdviUse" href="#i-eye"/></svg></button>
        <button class="dots-t" data-tip="Layer options"><svg class="icon sm"><use href="#i-more"/></svg></button>
      </div>
      <div class="layer-row" data-layer="basemap" draggable="true">
        <span class="layer-drag-handle" data-tip="Drag to reorder"><svg class="icon sm"><use href="#i-grab"/></svg></span>
        <button class="eye-t" data-tip="Collapse row"><svg class="icon xs"><use href="#i-chev-down"/></svg></button>
        <span class="sw base"></span>
        <span class="lname" style="display:block">Basemap<small id="basemapDate">14 May 2025 &#x2039;</small></span>
        <div class="layer-opacity-wrap">
          <input class="layer-opacity" type="range" min="0" max="100" value="100" data-layer-opacity="basemap" style="--layer-opacity:100%" aria-label="Basemap opacity">
        </div>
        <button class="eye-t on" id="eyeBase" data-tip="Toggle visibility"><svg class="icon sm"><use id="eyeBaseUse" href="#i-eye"/></svg></button>
        <button class="dots-t" data-tip="Layer options"><svg class="icon sm"><use href="#i-more"/></svg></button>
      </div>
      <div class="layer-row" data-layer="osm" draggable="true">
        <span class="layer-drag-handle" data-tip="Drag to reorder"><svg class="icon sm"><use href="#i-grab"/></svg></span>
        <button class="eye-t" data-tip="Collapse row"><svg class="icon xs"><use href="#i-chev-down"/></svg></button>
        <span class="sw osm"></span>
        <span class="lname" style="display:block">OpenStreetMap<small>Live OSM tiles</small></span>
        <div class="layer-opacity-wrap">
          <input class="layer-opacity" type="range" min="0" max="100" value="100" data-layer-opacity="osm" style="--layer-opacity:100%" aria-label="OSM opacity">
        </div>
        <button class="eye-t on" id="eyeOsm" data-tip="Toggle visibility"><svg class="icon sm"><use id="eyeOsmUse" href="#i-eye"/></svg></button>
        <button class="dots-t" data-tip="Layer options"><svg class="icon sm"><use href="#i-more"/></svg></button>
      </div>
    </div>

    <div class="tracks-scroller">
      <div class="tracks" id="tracks">
        <div class="ruler" id="ruler"></div>
        <div class="track basemap-track" data-track-layer="basemap"><div class="gridlines"></div></div>
        <div class="track osm-track" data-track-layer="osm"><div class="gridlines"></div></div>
        <div class="track ndvi-track" data-track-layer="dem">
          <div class="gridlines"></div>
          <button class="kf" data-pos="18" data-date="13 Mar 2026" style="left:18%" data-tip="13 Mar 2026"></button>
          <button class="kf" data-pos="42" data-date="28 Mar 2026" style="left:42%" data-tip="28 Mar 2026"></button>
          <button class="kf" data-pos="86" data-date="27 Apr 2026" style="left:86%" data-tip="27 Apr 2026"></button>
        </div>
        <div class="playhead" id="playhead"><span class="trail"></span></div>
      </div>
    </div>
  </div>
</section>
`);
