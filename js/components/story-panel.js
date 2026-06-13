/* Component: story-panel — story aside with slides, charts, and DEM compare */
NB.mountComponent('nb-story-panel', `
<aside class="story-panel" id="storyPanel" aria-label="Story">
  <div class="sp-head glass" data-reveal style="--d:.34s">
    <div class="sp-toprow">
      <div class="coords">
        <span>44.507123, 40.182983</span>
        <button id="copyCoords" data-tip="Copy coordinates"><svg class="icon xs"><use href="#i-copy"/></svg></button>
      </div>
      <button class="share-chip" id="shareBtn">Share <svg class="icon xs"><use href="#i-link"/></svg></button>
      <div class="gap"></div>
      <button class="pico" data-pico="download" data-tip="Export story"><svg class="icon sm"><use href="#i-dl"/></svg></button>
      <button class="pico" data-pico="send" data-tip="Send to team"><svg class="icon sm"><use href="#i-send"/></svg></button>
      <button class="pico" data-pico="expand" data-tip="Expand panel"><svg class="icon sm"><use href="#i-expand"/></svg></button>
      <button class="pico" data-pico="more" data-tip="More"><svg class="icon sm"><use href="#i-more"/></svg></button>
      <button class="pico" data-pico="close" data-tip="Close story"><svg class="icon sm"><use href="#i-close"/></svg></button>
    </div>
    <h1 class="sp-title">A one-year journey from a dangerous environment to a safe one in the area of <span class="hl">Liwa</span>.</h1>
    <div class="dots" id="dots">
      <div class="dots-nav" id="dotsNav"></div>
      <div class="dots-play" id="dotsPlay">
        <button class="dots-play-ic" id="prevK" data-tip="Previous keyframe" aria-label="Previous keyframe">
          <svg class="icon sm"><use href="#i-prev"/></svg>
        </button>
        <button class="dots-play-main" id="playBtn" aria-label="Play story timeline">
          <svg class="icon sm"><use id="playUse" href="#i-play"/></svg>
          <span id="playLbl">Play</span>
        </button>
        <button class="dots-play-ic" id="nextK" data-tip="Next keyframe" aria-label="Next keyframe">
          <svg class="icon sm"><use href="#i-next"/></svg>
        </button>
      </div>
    </div>
  </div>

  <div class="sp-scroll">
    <div class="sp-section glass" style="border-radius:var(--r-lg)">

      <!-- slide text -->
      <div class="fade-swap" id="slideWrap" data-section="0" data-label="Overview">
        <h3 class="slide-title" id="slideTitle">The canopy cover has increased by <b class="hl">12%</b></h3>
        <p class="slide-body" id="slideBody"></p>
      </div>

      <!-- ── Liwa area info ── -->
      <div class="wcard lw-meta" data-reveal-io data-section data-label="Area info">
        <div class="lw-name-row">
          <span class="lw-name">Liwa</span>
          <span class="lw-badge">Managed Area</span>
        </div>
        <p class="w-desc">A <strong>1,831 ha</strong> protected desert landscape in Abu Dhabi. Monitoring began in January 2023 to track the recovery of native flora and fauna following decades of disturbance from unregulated grazing and off-road vehicle activity.</p>
        <div class="lw-grid">
          <div class="lw-item"><em>Managed Area</em><b>1,831 ha</b></div>
          <div class="lw-item"><em>Latest Survey</em><b>1,831 ha</b><small>Jan 2024</small></div>
          <div class="lw-item"><em>Date created</em><b>Jan 2023</b></div>
          <div class="lw-item"><em>Last activity</em><b>Jan 2024</b></div>
        </div>
      </div>

      <!-- ── Area classification insights ── -->
      <div class="wcard lw-classif" data-reveal-io data-section data-label="Land cover">
        <div class="w-head">
          <h4>Area classification insights</h4>
          <span class="lw-date-tag">Jan 2024</span>
        </div>
        <p class="w-desc">Satellite-derived land cover shows the area is <strong>dominated by open bareground</strong> (97% of mapped extent). Sparse shrub cover (0.45 ha) marks early-stage vegetation recovery, while infrastructure remains minimal — a positive indicator for rewilding potential.</p>
        <p class="lw-compare-lbl">Compare intersection</p>
        <div class="lw-bars">
          <div class="lw-bar-row" style="--lw-delay:0s">
            <div class="lw-bar-label"><span class="lw-dot" style="background:#8fa88a"></span>Bareground</div>
            <div class="lw-bar-track"><div class="lw-bar-fill" style="--lw-pct:97%;background:#8fa88a"></div></div>
            <div class="lw-bar-meta">1,585 ha<em>100%</em></div>
          </div>
          <div class="lw-bar-row" style="--lw-delay:.18s">
            <div class="lw-bar-label"><span class="lw-dot" style="background:#e8a84a"></span>Infrastructure</div>
            <div class="lw-bar-track"><div class="lw-bar-fill" style="--lw-pct:2%;background:#e8a84a"></div></div>
            <div class="lw-bar-meta">38 sqm<em>0%</em></div>
          </div>
          <div class="lw-bar-row" style="--lw-delay:.34s">
            <div class="lw-bar-label"><span class="lw-dot" style="background:#4a9d6a"></span>Trees and shrub</div>
            <div class="lw-bar-track"><div class="lw-bar-fill" style="--lw-pct:3.5%;background:#4a9d6a"></div></div>
            <div class="lw-bar-meta">0.45 ha<em>0.03%</em></div>
          </div>
        </div>
      </div>

      <!-- ── Native fauna survey ── -->
      <div class="wcard lw-fauna" data-reveal-io data-section data-label="Native fauna">
        <div class="w-head">
          <h4>Native fauna survey <svg class="icon xs info-i" data-info="Field observations from Jan 2024 survey within the Liwa area (1,831 ha)."><use href="#i-info"/></svg></h4>
          <span class="lw-date-tag">Jan 2024</span>
        </div>
        <p class="w-desc">Ground transect surveys across the full perimeter recorded <strong>142 camel track clusters</strong> — the primary human-induced pressure — alongside rare sightings of <strong>Arabian Sand Gazelle</strong> and one Arabian camel. The skeleton observation points to previous mortality events within the boundary.</p>
        <div class="lw-fauna-grid">
          <div class="lw-fauna-item" style="--fi-clr:#e8b84a">
            <div class="lw-fauna-count"><span data-count="142">0</span></div>
            <div class="lw-fauna-name">Camel tracks</div>
            <div class="lw-fauna-rate">0.078 / ha</div>
          </div>
          <div class="lw-fauna-item" style="--fi-clr:#4a9d6a">
            <div class="lw-fauna-count"><span data-count="2">0</span></div>
            <div class="lw-fauna-name">Arabian Sand Gazelle</div>
            <div class="lw-fauna-rate">0.0011 / ha</div>
          </div>
          <div class="lw-fauna-item" style="--fi-clr:#d07060">
            <div class="lw-fauna-count"><span data-count="1">0</span></div>
            <div class="lw-fauna-name">Skeleton</div>
            <div class="lw-fauna-rate">0.0005 / ha</div>
          </div>
          <div class="lw-fauna-item" style="--fi-clr:#c8a870">
            <div class="lw-fauna-count"><span data-count="1">0</span></div>
            <div class="lw-fauna-name">Arabian camel</div>
            <div class="lw-fauna-rate">0.0005 / ha</div>
          </div>
        </div>
      </div>

      <!-- ── Impact classification ── -->
      <div class="wcard lw-enter" data-reveal-io data-section data-label="Impact">
        <div class="w-head">
          <h4>Impact classification <svg class="icon xs info-i" data-info="Ground-survey features counted within the Liwa area. Bar widths use √-scale for readability."><use href="#i-info"/></svg></h4>
          <span class="lw-date-tag">Jan 2024</span>
        </div>
        <p class="w-desc"><strong>Litter (2,466) and machine tracks (816)</strong> are the dominant anthropogenic pressures. Fencing and gates are sparse, suggesting the boundary lacks formal enforcement infrastructure. Addressing litter and track proliferation are the highest-priority interventions for this reporting period.</p>
        <canvas id="impactChart" width="420" height="200" style="width:100%;height:200px;display:block;margin-top:10px"></canvas>
      </div>
      <div class="wcard" style="padding:0;overflow:hidden" data-section data-label="Survival flow" data-reveal-io>
        <div style="padding:12px 14px 0">
          <h4 style="font-size:13.5px;font-weight:600;margin-bottom:4px">Mangrove survival flow</h4>
          <p class="w-desc" style="margin-bottom:10px">Tracks the fate of every propagule from planting through to mature canopy. Each transition reveals where losses concentrate — <strong>desiccation and tidal washout</strong> account for the largest drop-off in the first two stages, while established trees show strong survival rates thereafter.</p>
        </div>
        <canvas id="sankeyChart" width="420" height="200" style="width:100%;height:200px;display:block"></canvas>
        <div class="sankey-foot">
          <button class="sfoot-btn primary"><svg class="icon xs"><use href="#i-dl"/></svg> Download</button>
          <button class="sfoot-btn ghost">Ask</button>
          <div style="flex:1"></div>
          <button class="sfoot-ico" data-tip="Refresh"><svg class="icon sm"><use href="#i-rotate"/></svg></button>
          <button class="sfoot-ico" data-tip="Trend"><svg class="icon sm"><use href="#i-trend"/></svg></button>
          <button class="sfoot-ico" data-tip="Copy"><svg class="icon sm"><use href="#i-copy"/></svg></button>
          <button class="sfoot-ico" data-tip="Send"><svg class="icon sm"><use href="#i-send"/></svg></button>
          <button class="sfoot-ico" data-tip="Link"><svg class="icon sm"><use href="#i-link"/></svg></button>
        </div>
      </div>

      <!-- area classification -->
      <div class="wcard" data-section data-label="Classification" data-reveal-io>
        <div class="w-head">
          <h4>Area classification over time <svg class="icon xs info-i" data-info="Land cover derived from satellite imagery (10 m resolution)."><use href="#i-info"/></svg></h4>
        </div>
        <p class="w-desc">Multi-year land-cover change derived from 10 m resolution satellite imagery. Rising <strong>vegetation extent</strong> confirms that restoration interventions are converting bareground to structured habitat — a critical milestone for biodiversity recolonisation.</p>
        <canvas id="areaChart" width="420" height="155" style="width:100%;height:155px;display:block;margin-top:12px"></canvas>
        <div class="area-legend">
          <span class="area-leg-item"><i style="background:#2d6645"></i>Bareground</span>
          <span class="area-leg-item"><i style="background:#3a8a5c"></i>Water</span>
          <span class="area-leg-item"><i style="background:#3ce8a6"></i>Vegetation</span>
        </div>
      </div>

      <!-- habitat health radar -->
      <div class="wcard" data-section data-label="Habitat health" data-reveal-io>
        <div style="display:flex;align-items:flex-start;gap:12px">
          <div style="flex:0 0 auto;padding-top:2px">
            <div class="w-head"><h4>Habitat health index</h4></div>
            <div class="w-sub">Multi-factor assessment</div>
            <p class="w-desc" style="max-width:130px;margin-top:8px">Composite score across five axes. <strong>Biodiversity (55)</strong> and Soil Health (48) are the lowest-scoring dimensions — the key targets for the next management cycle.</p>
            <div style="margin-top:16px;font-size:11px;color:var(--text-3)">Overall Health Index</div>
            <div style="font-size:22px;font-weight:700;color:var(--mint);font-family:var(--font-mono);margin-top:3px">
              <span data-count="78" data-suffix="">0</span>/100
            </div>
          </div>
          <canvas id="radarChart" width="230" height="190" style="flex:1;min-width:0;height:190px"></canvas>
        </div>
      </div>

      <!-- data update bubble chart -->
      <div class="wcard" data-section data-label="Data updates" data-reveal-io>
        <div class="w-head">
          <h4>Data update per project <svg class="icon xs info-i" data-info="Bubble size represents data volume per update event."><use href="#i-info"/></svg></h4>
        </div>
        <p class="w-desc">Each bubble represents a data submission event — size encodes volume, position encodes recency vs. completeness. Projects clustering in the upper-right quadrant are both <strong>up to date and data-rich</strong>; lower-left outliers require follow-up.</p>
        <canvas id="bubbleChart" width="420" height="185" style="width:100%;height:185px;display:block;margin-top:8px"></canvas>
        <div class="bubble-legend">
          <span class="bleg-item"><i style="background:#4a90d9"></i>Long_project_name_1</span>
          <span class="bleg-item"><i style="background:#c4921a"></i>Long_project_name_2</span>
          <span class="bleg-item"><i style="background:#c04080"></i>Project 3</span>
          <span class="bleg-item"><i style="background:#3cb8a6"></i>Project 4</span>
          <span class="bleg-item"><i style="background:#c4bc20"></i>Project 5</span>
        </div>
      </div>

      <!-- biomass growth -->
      <div class="wcard" data-section data-label="Biomass" data-reveal-io>
        <div class="w-head">
          <div>
            <h4>Total biomass growth <svg class="icon xs info-i" data-info="Above-ground biomass estimated from canopy height &times; allometric model."><use href="#i-info"/></svg></h4>
            <div class="w-sub">Tonnes per hectare over time</div>
          </div>
          <div class="gap"></div>
          <span class="badge"><svg class="icon xs"><use href="#i-trend"/></svg>+<span data-count="29.42" data-decimals="2" data-format="eu">0</span>%</span>
        </div>
        <p class="w-desc">Above-ground biomass modelled from canopy height data using species-specific allometric equations. The <strong>sharp gain after May planting</strong> reflects a successful nursery cohort transition — the trajectory now sits 29% above the restoration baseline established in 2023.</p>
        <div class="chart-wrap">
          <canvas id="biomassChart" width="420" height="240" style="width:100%;height:240px;display:block"></canvas>
          <div class="chart-tip" id="chartTip"></div>
        </div>
        <div class="stat-row">
          <div class="stat" data-info="Latest model run &middot; May 2026"><em>Current (2026)</em><b><span data-count="145">0</span>&nbsp;t/ha <svg class="icon info-i xs"><use href="#i-info"/></svg></b></div>
          <div class="stat" data-info="Net gain since baseline"><em>Total Growth</em><b>+<span data-count="25">0</span> <svg class="icon info-i xs"><use href="#i-info"/></svg></b></div>
          <div class="stat" data-info="Mean annual accumulation"><em>Avg. Annual</em><b>+<span data-count="12.5" data-decimals="1">0</span> <svg class="icon info-i xs"><use href="#i-info"/></svg></b></div>
        </div>
      </div>

      <!-- duo widgets -->
      <div class="duo" data-section data-label="Veg & cover" data-reveal-io>
        <div class="wcard">
          <h5>Vegetation health</h5>
          <p class="w-desc" style="margin-top:4px">Mean NDVI across the full polygon, cloud-masked. Values above 0.6 indicate active photosynthesis.</p>
          <div class="val"><span data-count="0.8" data-decimals="1">0</span>&nbsp;avg NDVI <svg class="icon xs info-i" data-info="Mean NDVI across the polygon, cloud-masked."><use href="#i-info"/></svg></div>
          <div class="foot"><span class="badge"><svg class="icon xs"><use href="#i-trend"/></svg>+3%</span> QoQ</div>
        </div>
        <div class="wcard">
          <h5>Land cover change</h5>
          <p class="w-desc" style="margin-top:4px">Share of the polygon classified as vegetated land cover. <strong>+8.5 ha</strong> gained this quarter.</p>
          <div class="val"><span data-count="78">0</span>% <svg class="icon xs info-i" data-info="Share of the polygon classified as vegetated land cover."><use href="#i-info"/></svg></div>
          <div class="foot"><span class="badge"><svg class="icon xs"><use href="#i-trend"/></svg>+8% (8.5 ha)</span> QoQ</div>
        </div>
      </div>

      <!-- DEM compare -->
      <div class="wcard" style="padding:10px 10px 14px" data-section data-label="DEM compare" data-reveal-io>
        <div style="padding:4px 4px 10px">
          <h4 style="font-size:13.5px;font-weight:600;margin-bottom:4px">Elevation model comparison</h4>
          <p class="w-desc">Drag the divider to compare two DEM epochs side by side. <strong>Sediment accretion</strong> is visible as blue-to-green transitions in the inner channels — a direct indicator of successful mangrove-driven land building since 2025.</p>
        </div>
        <div class="cmp" id="cmp">
          <div class="pane b"><svg viewBox="0 0 440 200" preserveAspectRatio="xMidYMid slice"><rect width="440" height="200" fill="#888" filter="url(#fDemB)"/></svg></div>
          <div class="pane a"><svg viewBox="0 0 440 200" preserveAspectRatio="xMidYMid slice"><rect width="440" height="200" fill="#888" filter="url(#fDemA)"/></svg></div>
          <div class="cmp-line"></div>
          <button class="cmp-tag a" data-dem="DEM 23 May 2025"><svg class="icon xs"><use href="#i-ext"/></svg> DEM 23 May 2025</button>
          <button class="cmp-tag b" data-dem="DEM 14 May 2026"><svg class="icon xs"><use href="#i-ext"/></svg> DEM 14 May 2026</button>
          <div class="cmp-grip" id="cmpGrip"><svg class="icon sm"><use href="#i-grab"/></svg></div>
        </div>
        <div class="legend">
          <p><span class="key blue"></span><b>Blue &mdash; Lowest elevation.</b> The vast blue zones represent the deepest tidal channels and the lagoon floor.</p>
          <p><span class="key green"></span><b>Green &mdash; Low-lying land.</b> Green areas sit just above sea level, where mangrove colonisation becomes possible.</p>
        </div>
      </div>

    </div>
  </div>
</aside>
`);
