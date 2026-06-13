/* Leaflet map + procedurally generated raster layers.
   CFG.procedural=true → all imagery is generated at runtime (zero asset files).
   Flip to false to use the real exports listed in CFG.assets. */
(function(){
  'use strict';
  const NB=window.NB, $=NB.$;

  const CFG={
    procedural:true,
    assets:{
      basemaps:['Untitled-1.jpg','Untitled-2.jpg','Untitled-3.jpg','Untitled-4.jpg'],
      dem:['musiDEM.jpg','musiDEM2.jpg','musiDEM3.jpg']
    },
    aoi:[24.541,54.483],
    bounds:[[24.267,54.098],[24.815,54.868]],
    texW:512,texH:352
  };

  /* ---------- procedural texture factory ---------- */
  function makeNoise(seed){
    const rnd=NB.mulberry32(seed),SZ=96,g=new Float32Array(SZ*SZ);
    for(let i=0;i<g.length;i++)g[i]=rnd();
    const at=(x,y)=>g[(((y%SZ)+SZ)%SZ)*SZ+(((x%SZ)+SZ)%SZ)];
    const sm=t=>t*t*(3-2*t);
    return(x,y)=>{
      const x0=Math.floor(x),y0=Math.floor(y),fx=sm(x-x0),fy=sm(y-y0);
      return NB.lerp(NB.lerp(at(x0,y0),at(x0+1,y0),fx),NB.lerp(at(x0,y0+1),at(x0+1,y0+1),fx),fy);
    };
  }
  function fbm(n,x,y,oct){
    let a=0,amp=.5,f=1;
    for(let o=0;o<oct;o++){a+=n(x*f,y*f)*amp;f*=2.02;amp*=.5;}
    return a;
  }
  function buildField(seed,freq,shape){
    const W=CFG.texW,H=CFG.texH,n=makeNoise(seed),F=new Float32Array(W*H);
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      let e=fbm(n,x*freq,y*freq,5);
      /* gentle coastal falloff toward bottom-left lagoon */
      const cx=x/W,cy=y/H;
      e+= .14*(cx*.6+ (1-cy)*.4) - .07;
      F[y*W+x]=shape?shape(NB.clamp(e,0,1),cx,cy):NB.clamp(e,0,1);
    }
    return F;
  }
  function ramp(stops){
    return v=>{
      v=NB.clamp(v,0,1);
      let i=0;
      while(i<stops.length-2&&v>stops[i+1][0])i++;
      const a=stops[i],b=stops[i+1],t=(v-a[0])/Math.max(1e-6,b[0]-a[0]);
      return[NB.lerp(a[1],b[1],t),NB.lerp(a[2],b[2],t),NB.lerp(a[3],b[3],t)];
    };
  }
  function renderField(F,colorize,shadeAmt){
    const W=CFG.texW,H=CFG.texH;
    const c=document.createElement('canvas');c.width=W;c.height=H;
    const ctx=c.getContext('2d'),img=ctx.createImageData(W,H),d=img.data;
    const az=235*Math.PI/180,el=56*Math.PI/180;
    const lx=Math.cos(el)*Math.cos(az),ly=Math.cos(el)*Math.sin(az),lz=Math.sin(el);
    const SC=14;
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const i=y*W+x,v=F[i];
      const xr=F[y*W+Math.min(W-1,x+1)],yd=F[Math.min(H-1,y+1)*W+x];
      let nx=-(xr-v)*SC,ny=-(yd-v)*SC,nz=1;
      const nl=Math.sqrt(nx*nx+ny*ny+nz*nz);nx/=nl;ny/=nl;nz/=nl;
      const sh=NB.clamp(nx*lx+ny*ly+nz*lz,0,1);
      const shade=NB.lerp(1,(0.45+0.75*sh),shadeAmt);
      const[r,g,b,a]=colorize(v,x/W,y/H);
      const o=i*4;
      d[o]=NB.clamp(r*shade,0,255);d[o+1]=NB.clamp(g*shade,0,255);d[o+2]=NB.clamp(b*shade,0,255);
      d[o+3]=a===undefined?255:a;
    }
    ctx.putImageData(img,0,0);
    return c.toDataURL('image/png');
  }

  /* ---------- basemap × 4 (satellite moods) ---------- */
  function buildBasemaps(){
    const F=buildField(11,0.045);
    const water=.34;
    const ramps=[
      /* 0 Standard */ ramp([[0,8,46,58],[water,14,86,92],[water+.02,118,104,66],[.55,64,96,52],[.78,38,72,44],[1,26,48,34]]),
      /* 1 Vegetation */ ramp([[0,7,52,60],[water,12,96,94],[water+.02,96,112,58],[.5,52,118,62],[.78,30,92,52],[1,18,62,40]]),
      /* 2 Relief */ ramp([[0,30,42,48],[water,52,72,76],[water+.02,128,108,82],[.55,112,94,70],[.8,88,74,58],[1,60,52,44]]),
      /* 3 Fresh */ ramp([[0,10,58,76],[water,18,112,118],[water+.02,124,116,74],[.52,70,124,70],[.78,42,100,60],[1,28,70,46]])
    ];
    const shade=[.75,.7,.95,.65];
    return ramps.map((rp,i)=>renderField(F,(v)=>{
      const[r,g,b]=rp(v);
      /* sparkle on water for fresh/standard */
      return[r,g,b,255];
    },shade[i]));
  }

  /* ---------- DEM / NDVI growth × 3 ---------- */
  function buildDems(){
    const F=buildField(31,0.06,(e,cx,cy)=>NB.clamp(e*1.06-(cy*.08),0,1));
    const demRamp=ramp([[0,26,52,148],[.3,30,118,150],[.5,118,178,92],[.7,228,212,70],[.85,238,150,52],[1,240,236,210]]);
    const frames=[0,1,2].map(k=>renderField(F,(v)=>{
      /* growth: each frame lifts vegetated coverage */
      const g=NB.clamp(v*(0.84+0.13*k)+0.045*k,0,1);
      const[r,gg,b]=demRamp(g);
      return[r,gg,b,255];
    },.55));
    return frames;
  }

  /* ---------- MapLibre GL ---------- */
  const stageMapEl=$('#stageMap');
  const M={CFG,aoi:CFG.aoi,tex:{base:[],dem:[]},hover:{feature:false,latlng:null}};
  NB.map=M;

  M.tex.base=CFG.procedural?buildBasemaps():CFG.assets.basemaps.slice();
  M.tex.dem =CFG.procedural?buildDems():CFG.assets.dem.slice();

  /* ─ coordinate helpers ─ */
  /* CFG.bounds = [[swLat,swLng],[neLat,neLng]] (Leaflet convention) */
  const sw=CFG.bounds[0],ne=CFG.bounds[1];
  const swLat=sw[0],swLng=sw[1],neLat=ne[0],neLng=ne[1];
  /* MapLibre image corners: [NW, NE, SE, SW] each [lng, lat] */
  const IMG_COORDS=[[swLng,neLat],[neLng,neLat],[neLng,swLat],[swLng,swLat]];
  /* center in MapLibre [lng, lat] */
  const CENTER=[CFG.aoi[1],CFG.aoi[0]];

  const relLng=x=>swLng+(neLng-swLng)*x;
  const relLat=y=>neLat-(neLat-swLat)*y;
  const pt=(x,y)=>[relLng(x),relLat(y)];
  const oct=(id,cx,cy,r,props)=>({
    id,
    type:'Feature',properties:Object.assign({cx,cy,r},props||{}),
    geometry:{
      type:'Polygon',
      coordinates:[[...Array.from({length:8},(_,i)=>{
        const a=(-90+i*45)*(Math.PI/180);
        return pt(cx+Math.cos(a)*r,cy+Math.sin(a)*r);
      }),pt(cx,cy-r)]]
    }
  });
  const octSet=(layerKey,title,subtitle,metricLabel,metricUnit,items)=>({
    type:'FeatureCollection',
    features:items.map((item,idx)=>{
      const [x,y,r,value,delta]=item;
      return oct(layerKey+'-'+idx,x,y,r,{
        layerKey,
        title,
        subtitle,
        node:'Octagon '+String(idx+1).padStart(2,'0'),
        metricLabel,
        metricValue:String(value),
        metricUnit:metricUnit||'',
        delta:delta||''
      });
    })
  });
  const growOctSet=(fc,scale)=>({
    type:'FeatureCollection',
    features:fc.features.map(f=>oct(
      f.id,
      Number(f.properties.cx),
      Number(f.properties.cy),
      Number(f.properties.r)*scale,
      Object.assign({},f.properties)
    ))
  });
  const STORY_OVERLAYS={
    moisture:{
      color:'#6e8fff',fillOpacity:.045,lineOpacity:.84,lineWidth:2,dash:[2.6,1.4],
      data:octSet('moisture','Soil moisture','SAR composite','Moisture','%',[ [.22,.27,.055,62,'+4%'],[.46,.33,.050,54,'-2%'],[.67,.24,.048,71,'+6%'],[.58,.59,.060,49,'+1%'] ])
    },
    canopy:{
      color:'#62d39b',fillOpacity:.045,lineOpacity:.84,lineWidth:2.1,dash:[1.8,1.2],
      data:octSet('canopy','Canopy height','Photogrammetry','Height','m',[ [.29,.23,.052,2.6,'+0.3'],[.56,.28,.064,3.8,'+0.5'],[.73,.48,.051,2.1,'+0.2'],[.36,.61,.058,4.4,'+0.7'] ])
    },
    tidal:{
      color:'#7ad8ff',fillOpacity:.04,lineOpacity:.82,lineWidth:2,dash:[4,1.7],
      data:octSet('tidal','Tidal extent','Hydrology model','Inundation','ha',[ [.19,.53,.056,12.4,'spring'],[.39,.44,.052,9.1,'neap'],[.63,.61,.060,14.8,'spring'],[.76,.34,.046,7.6,'neap'] ])
    },
    'liwa-meta':{
      color:'#e8c98a',fillOpacity:.05,lineOpacity:.88,lineWidth:2.2,dash:[1.5,1.25],
      data:octSet('liwa-meta','Liwa area info','Site metadata','Managed area','ha',[ [.24,.27,.055,312,'sector A'],[.42,.20,.046,248,'sector B'],[.61,.26,.054,377,'sector C'],[.72,.47,.064,426,'sector D'],[.48,.62,.074,468,'sector E'] ])
    },
    'liwa-classif':{
      color:'#8fd86a',fillOpacity:.06,lineOpacity:.82,lineWidth:2,dash:[3,1.6],
      data:octSet('liwa-classif','Area classification insights','Land cover · Jan 2024','Cover share','%',[ [.24,.31,.040,18,'bareground'],[.38,.30,.050,24,'shrubs'],[.56,.31,.052,31,'stabilized'],[.69,.39,.044,12,'disturbed'],[.48,.58,.070,41,'mixed cover'] ])
    },
    'liwa-fauna':{
      color:'#ffb347',fillOpacity:.04,lineOpacity:.84,lineWidth:2,dash:[1.2,2.2],
      data:octSet('liwa-fauna','Native fauna survey','Field observations','Sightings','obs',[ [.26,.34,.032,6,'gazelle'],[.61,.31,.032,4,'fox'],[.44,.59,.038,9,'lark'],[.72,.55,.034,3,'reptile'],[.34,.46,.028,5,'mixed'] ])
    },
    'liwa-impact':{
      color:'#ff7e5f',fillOpacity:.05,lineOpacity:.88,lineWidth:2.3,dash:[4,2],
      data:octSet('liwa-impact','Impact classification','Ground survey','Impact score','pts',[ [.28,.67,.045,14,'low'],[.49,.32,.034,22,'medium'],[.66,.50,.055,31,'high'],[.77,.41,.030,11,'low'] ])
    },
    'mgr-flow':{
      color:'#5de8c8',fillOpacity:.03,lineOpacity:.86,lineWidth:2,dash:[5,1.8],
      data:octSet('mgr-flow','Mangrove survival flow','Sankey · propagule → canopy','Throughput','units',[ [.21,.49,.034,84,'intake'],[.34,.46,.040,73,'nursery'],[.48,.47,.044,59,'planting'],[.62,.45,.038,48,'rooted'],[.75,.43,.032,34,'canopy'] ])
    },
    'area-time':{
      color:'#a56eff',fillOpacity:.04,lineOpacity:.82,lineWidth:2,dash:[2.5,1.5],
      data:octSet('area-time','Area classification over time','Satellite 10 m','Change','ha',[ [.22,.25,.030,2.4,'2023'],[.34,.24,.030,2.8,'2023'],[.48,.24,.030,3.5,'2023'],[.62,.25,.030,3.1,'2023'],[.74,.26,.030,2.2,'2023'],[.30,.39,.030,4.2,'2024'],[.44,.40,.030,5.1,'2024'],[.58,.40,.030,4.7,'2024'],[.70,.40,.030,3.9,'2024'],[.38,.55,.030,5.8,'2025'],[.53,.55,.030,6.1,'2025'],[.64,.55,.030,5.4,'2025'] ])
    },
    'habitat':{
      color:'#8aff6e',fillOpacity:.05,lineOpacity:.86,lineWidth:2.1,dash:[1.8,1.2],
      data:octSet('habitat','Habitat health index','Composite score','Health','/100',[ [.34,.28,.048,74,'stable'],[.56,.31,.060,81,'rising'],[.41,.61,.054,69,'watch'],[.57,.66,.045,77,'stable'] ])
    },
    'data-upd':{
      color:'#6ab0ff',fillOpacity:.04,lineOpacity:.84,lineWidth:2,dash:[3.2,1.4],
      data:octSet('data-upd','Data update per project','Survey events','Updates','count',[ [.24,.30,.030,12,'Q1'],[.41,.38,.038,18,'Q2'],[.58,.29,.042,9,'Q2'],[.70,.57,.048,21,'Q3'],[.33,.60,.040,15,'Q3'] ])
    },
    biomass:{
      color:'#72f55a',fillOpacity:.045,lineOpacity:.86,lineWidth:2.1,dash:[2.2,1.1],
      data:octSet('biomass','Total biomass growth','Above-ground · t/ha','Biomass','t/ha',[ [.23,.37,.044,118,'+9'],[.42,.50,.060,145,'+12'],[.61,.42,.052,131,'+7'],[.73,.63,.044,152,'+14'] ])
    },
    'veg-cover':{
      color:'#40f5b0',fillOpacity:.042,lineOpacity:.84,lineWidth:2,dash:[3.4,1.4],
      data:octSet('veg-cover','Vegetation & cover','NDVI + land cover','NDVI','index',[ [.27,.24,.040,0.42,'patch A'],[.48,.29,.050,0.57,'patch B'],[.68,.34,.040,0.39,'patch C'],[.34,.56,.055,0.63,'patch D'],[.57,.61,.052,0.54,'patch E'] ])
    },
    'dem-cmp':{
      color:'#9aafd4',fillOpacity:.04,lineOpacity:.84,lineWidth:2,dash:[5,1.6],
      data:octSet('dem-cmp','Elevation model comparison','DEM A vs DEM B','Delta Z','cm',[ [.30,.33,.062,12,'A>B'],[.56,.38,.072,-8,'B>A'],[.46,.64,.084,21,'A>B'] ])
    }
  };
  const overlayOpacityState=Object.fromEntries(Object.keys(STORY_OVERLAYS).map(k=>[k,1]));
  const overlayVisibleState=Object.fromEntries(Object.keys(STORY_OVERLAYS).map(k=>[k,false]));

  /* 1×1 transparent PNG — placeholder until real textures load after map init */
  const BLANK='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjE+ibYAAAAASUVORK5CYII=';

  if(stageMapEl&&typeof maplibregl!=='undefined'){
    const map=new maplibregl.Map({
      container:stageMapEl,
      style:{
        version:8,
        sources:{
          osm:    {type:'raster',tiles:['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                   tileSize:256,attribution:'© OpenStreetMap contributors',maxzoom:19},
          basemap:{type:'image',url:BLANK,coordinates:IMG_COORDS},
          dem:    {type:'image',url:BLANK,coordinates:IMG_COORDS},
          'dem-area':{type:'geojson',data:{type:'Feature',geometry:{
            type:'Polygon',
            coordinates:[[[swLng,swLat],[neLng,swLat],[neLng,neLat],[swLng,neLat],[swLng,swLat]]]
          }}}
        },
        layers:[
          {id:'osm-layer',    type:'raster',source:'osm',
           paint:{'raster-saturation':-0.24,'raster-contrast':-0.08,'raster-brightness-max':0.55,'raster-opacity':0.95}},
          {id:'basemap-layer',type:'raster',source:'basemap',paint:{'raster-opacity':1}},
          {id:'dem-layer',    type:'raster',source:'dem',    paint:{'raster-opacity':1}},
          {id:'dem-area-fill',type:'fill',  source:'dem-area',
           paint:{'fill-color':'transparent','fill-opacity':0}}
        ]
      },
      center:CENTER,zoom:11,bearing:0,pitch:0,
      attributionControl:true
    });
    M.map=map;
    M.bounds=[[swLat,swLng],[neLat,neLng]];
    const storyPopup=new maplibregl.Popup({closeButton:false,closeOnClick:false,offset:14,className:'story-oct-popup'});
    let hoveredStoryKey=null,hoveredStoryId=null;
    let hoverPulseRaf=0;

    function applyOverlayBase(layerKey){
      if(!M.map||!STORY_OVERLAYS[layerKey])return;
      const def=STORY_OVERLAYS[layerKey];
      const op=overlayOpacityState[layerKey]??1;
      const baseFill=Math.max(def.fillOpacity,.16)*op;
      const baseLine=Math.max(def.lineOpacity,.95)*op;
      try{M.map.setPaintProperty('story-fill-'+layerKey,'fill-opacity',baseFill);}catch(e){}
      try{M.map.setPaintProperty('story-line-'+layerKey,'line-opacity',baseLine);}catch(e){}
      try{M.map.setPaintProperty('story-line-'+layerKey,'line-width',def.lineWidth+1.25);}catch(e){}
      try{M.map.setPaintProperty('story-hover-fill-'+layerKey,'fill-opacity',0.14*op);}catch(e){}
      try{M.map.setPaintProperty('story-hover-fill-'+layerKey,'fill-translate',[0,0]);}catch(e){}
      try{M.map.setPaintProperty('story-hover-shadow-'+layerKey,'fill-opacity',0.34*op);}catch(e){}
      try{M.map.setPaintProperty('story-hover-shadow-'+layerKey,'fill-translate',[4,-4]);}catch(e){}
      try{M.map.setPaintProperty('story-glow-'+layerKey,'line-opacity',Math.min(0.95,def.lineOpacity*op));}catch(e){}
      try{M.map.setPaintProperty('story-glow-'+layerKey,'line-width',def.lineWidth+8);}catch(e){}
      try{M.map.setPaintProperty('story-glow-'+layerKey,'line-blur',2.4);}catch(e){}
      try{M.map.setPaintProperty('story-hover-lift-'+layerKey,'fill-extrusion-opacity',0.22*op);}catch(e){}
      try{M.map.setPaintProperty('story-hover-lift-'+layerKey,'fill-extrusion-height',18);}catch(e){}
    }

    function startHoverPulse(){
      if(hoverPulseRaf)return;
      const tick=t=>{
        if(!hoveredStoryKey||!M.map){hoverPulseRaf=0;return;}
        const key=hoveredStoryKey;
        const def=STORY_OVERLAYS[key];
        if(!def){hoverPulseRaf=0;return;}
        const op=overlayOpacityState[key]??1;
        const pulse=(Math.sin(t*0.012)+1)*0.5;
        const pitchBoost=(M.map.getPitch?M.map.getPitch()/72:0);
        try{M.map.setPaintProperty('story-hover-fill-'+key,'fill-opacity',(0.16+pulse*0.12)*op);}catch(e){}
        try{M.map.setPaintProperty('story-hover-fill-'+key,'fill-translate',[0,-(1.5+pulse*3.5)]);}catch(e){}
        try{M.map.setPaintProperty('story-hover-shadow-'+key,'fill-opacity',(0.18+pulse*0.18)*op);}catch(e){}
        try{M.map.setPaintProperty('story-hover-shadow-'+key,'fill-translate',[4.5+pulse*2.5,-(4.5+pulse*2.5)]);}catch(e){}
        try{M.map.setPaintProperty('story-glow-'+key,'line-opacity',Math.min(1,(0.7+pulse*0.3)*op));}catch(e){}
        try{M.map.setPaintProperty('story-glow-'+key,'line-width',def.lineWidth+10+pulse*7);}catch(e){}
        try{M.map.setPaintProperty('story-glow-'+key,'line-blur',2.8+pulse*3.8);}catch(e){}
        try{M.map.setPaintProperty('story-hover-lift-'+key,'fill-extrusion-opacity',(0.22+pulse*0.16)*op);}catch(e){}
        try{M.map.setPaintProperty('story-hover-lift-'+key,'fill-extrusion-height',24+pulse*18+pitchBoost*36);}catch(e){}
        hoverPulseRaf=requestAnimationFrame(tick);
      };
      hoverPulseRaf=requestAnimationFrame(tick);
    }

    function setStoryHover(layerKey,featureId){
      if(!M.map||!STORY_OVERLAYS[layerKey])return;
      const filter=featureId==null?['==',['id'],'__none__']:['==',['id'],featureId];
      try{M.map.setFilter('story-hover-shadow-'+layerKey,filter);}catch(e){}
      try{M.map.setFilter('story-hover-fill-'+layerKey,filter);}catch(e){}
      try{M.map.setFilter('story-glow-'+layerKey,filter);}catch(e){}
      try{M.map.setFilter('story-hover-lift-'+layerKey,filter);}catch(e){}
    }

    function clearStoryHover(){
      if(hoveredStoryKey!=null){
        setStoryHover(hoveredStoryKey,null);
        applyOverlayBase(hoveredStoryKey);
      }
      if(hoverPulseRaf){cancelAnimationFrame(hoverPulseRaf);hoverPulseRaf=0;}
      hoveredStoryKey=null;hoveredStoryId=null;
      map.getCanvas().style.cursor='';
      storyPopup.remove();
    }

    function placeAnchor(lnglat){
      if(!lnglat)return;
      const p=map.project(lnglat);
      const canvas=map.getCanvas();
      const x=NB.clamp((p.x/canvas.offsetWidth )*100,4,96);
      const y=NB.clamp((p.y/canvas.offsetHeight)*100,8,88);
      const a=$('#demAnchor');
      if(a){a.style.left=x+'%';a.style.top=y+'%';}
    }
    M.placeAnchor=latlng=>{
      if(!latlng)return;
      const lng=Array.isArray(latlng)?latlng[1]:(latlng.lng??latlng[1]);
      const lat=Array.isArray(latlng)?latlng[0]:(latlng.lat??latlng[0]);
      placeAnchor({lng,lat});
    };

    map.on('load',()=>{
      /* swap placeholders → real procedural textures now that GL context is ready */
      map.getSource('basemap').updateImage({url:M.tex.base[0],coordinates:IMG_COORDS});
      map.getSource('dem').updateImage({url:M.tex.dem[0],coordinates:IMG_COORDS});

      Object.entries(STORY_OVERLAYS).forEach(([key,def])=>{
        const src='story-src-'+key,fill='story-fill-'+key,line='story-line-'+key;
        const hoverSrc='story-hover-src-'+key;
        const hoverShadow='story-hover-shadow-'+key;
        const hoverFill='story-hover-fill-'+key;
        const glow='story-glow-'+key;
        const hoverLift='story-hover-lift-'+key;
        map.addSource(src,{type:'geojson',data:def.data,generateId:true});
        map.addSource(hoverSrc,{type:'geojson',data:growOctSet(def.data,1.14),generateId:true});
        map.addLayer({
          id:fill,type:'fill',source:src,layout:{visibility:'none'},
          /* tiny opacity so MapLibre fires mouse events on this hit-target layer */
          paint:{'fill-color':def.color,'fill-opacity':0.01}
        });
        map.addLayer({
          id:hoverShadow,type:'fill',source:hoverSrc,
          layout:{visibility:'none'},
          filter:['==',['id'],'__none__'],
          paint:{
            'fill-color':'#03120d',
            'fill-opacity':0.34,
            'fill-translate':[4,-4]
          }
        });
        map.addLayer({
          id:hoverFill,type:'fill',source:hoverSrc,
          layout:{visibility:'none'},
          filter:['==',['id'],'__none__'],
          paint:{
            'fill-color':'#ffffff',
            'fill-opacity':0.14
          }
        });
        map.addLayer({
          id:glow,type:'line',source:hoverSrc,layout:{visibility:'none','line-join':'round','line-cap':'round'},
          filter:['==',['id'],'__none__'],
          paint:{
            'line-color':'#f8fffd',
            'line-opacity':0.98,
            'line-width':def.lineWidth+8,
            'line-blur':2.4
          }
        });
        map.addLayer({
          id:hoverLift,type:'fill-extrusion',source:hoverSrc,
          layout:{visibility:'none'},
          filter:['==',['id'],'__none__'],
          paint:{
            'fill-extrusion-color':def.color,
            'fill-extrusion-opacity':0.22,
            'fill-extrusion-height':18,
            'fill-extrusion-base':0,
            'fill-extrusion-vertical-gradient':true
          }
        });
        map.addLayer({
          id:line,type:'line',source:src,layout:{visibility:'none'},
          paint:{
            'line-color':def.color,
            'line-opacity':0,
            'line-width':def.lineWidth,
            'line-dasharray':def.dash
          },
          layout:{'line-join':'round','line-cap':'round',visibility:'none'}
        });

        map.on('mouseenter',fill,()=>{ map.getCanvas().style.cursor='pointer'; });
        map.on('mousemove',fill,e=>{
          const f=e.features&&e.features[0];
          if(!f)return;
          const featureId=f.id;
          if(hoveredStoryKey!==key||hoveredStoryId!==featureId){
            if(hoveredStoryKey!=null&&hoveredStoryKey!==key){
              setStoryHover(hoveredStoryKey,null);
              applyOverlayBase(hoveredStoryKey);
            }
            hoveredStoryKey=key;hoveredStoryId=featureId;
            setStoryHover(key,featureId);
            startHoverPulse();
          }
          const p=f.properties||{};
          const metricValue=p.metricValue||'--';
          const metricUnit=p.metricUnit?(' '+p.metricUnit):'';
          const delta=p.delta?('<br><small>'+p.delta+'</small>'):'';
          storyPopup
            .setLngLat(e.lngLat)
            .setHTML('<div class="story-oct-tip"><b>'+p.title+'</b><span>'+p.subtitle+'</span><hr><strong>'+p.node+'</strong><p>'+p.metricLabel+': <em>'+metricValue+metricUnit+'</em>'+delta+'</p></div>')
            .addTo(map);
        });
        map.on('mouseleave',fill,()=>{ clearStoryHover(); });

        applyOverlayBase(key);
        if(overlayVisibleState[key]){
          try{M.map.setLayoutProperty(fill,'visibility','visible');}catch(e){}
          try{M.map.setLayoutProperty(hoverShadow,'visibility','visible');}catch(e){}
          try{M.map.setLayoutProperty(hoverFill,'visibility','visible');}catch(e){}
          try{M.map.setLayoutProperty(glow,'visibility','visible');}catch(e){}
          try{M.map.setLayoutProperty(hoverLift,'visibility','visible');}catch(e){}
          try{M.map.setLayoutProperty(line,'visibility','visible');}catch(e){}
        }
      });
      M.applyOrder();

      map.on('click','dem-area-fill',e=>{
        /* centre popup on click point */
        const canvas=map.getCanvas();
        const p=map.project(e.lngLat);
        const x=NB.clamp((p.x/canvas.offsetWidth)*100,4,82);
        const y=NB.clamp((p.y/canvas.offsetHeight)*100,4,62);
        const a=$('#demAnchor');
        if(a){a.style.left=x+'%';a.style.top=y+'%';}
        NB.bus.emit('dem:click');
      });
      map.on('mousemove','dem-area-fill',e=>{
        M.hover.feature=true;M.hover.latlng=e.lngLat;
        placeAnchor(e.lngLat);NB.bus.emit('dem:hover',{on:true});
      });
      map.on('mouseleave','dem-area-fill',()=>{
        M.hover.feature=false;NB.bus.emit('dem:hover',{on:false});
      });
      map.on('mousemove',e=>{
        if(M.hover.feature)placeAnchor(e.lngLat);
      });
      NB.bus.emit('map:moved');
    });

    /* keep M.cam in sync with MapLibre camera (covers built-in drag-rotate+pitch) */
    map.on('move',()=>{
      M.cam.bearing=map.getBearing();
      M.cam.pitch  =map.getPitch();
      NB.bus.emit('map:moved');
    });

    window.addEventListener('resize',()=>map.resize());
  }

  /* ---------- helpers ---------- */
  let baseIdx=0,demIdx=0;
  M.cam={pitch:0,bearing:0};

  M.setBaseImage=i=>{
    i=NB.clamp(i,0,M.tex.base.length-1);
    if(i===baseIdx)return;baseIdx=i;
    try{M.map.getSource('basemap').updateImage({url:M.tex.base[i],coordinates:IMG_COORDS});}catch(e){}
  };
  M.setDemImage=i=>{
    i=NB.clamp(i,0,M.tex.dem.length-1);
    if(i===demIdx)return;demIdx=i;
    try{M.map.getSource('dem').updateImage({url:M.tex.dem[i],coordinates:IMG_COORDS});}catch(e){}
  };
  M.setTileStyle=(filter,op)=>{
    const s=parseFloat((filter.match(/saturate\(([^)]+)\)/)||[,1])[1]);
    const c=parseFloat((filter.match(/contrast\(([^)]+)\)/)||[,1])[1]);
    const b=parseFloat((filter.match(/brightness\(([^)]+)\)/)||[,1])[1]);
    try{
      M.map.setPaintProperty('osm-layer','raster-saturation',  isNaN(s)?-0.24:s-1);
      M.map.setPaintProperty('osm-layer','raster-contrast',    isNaN(c)?-0.08:c-1);
      M.map.setPaintProperty('osm-layer','raster-brightness-max',isNaN(b)?0.55:b);
      M.map.setPaintProperty('osm-layer','raster-opacity',     NB.clamp(Number(op),0,1));
    }catch(e){}
  };
  M.setDemOpacity =v=>{try{M.map.setPaintProperty('dem-layer',    'raster-opacity',NB.clamp(v,0,1));}catch(e){}};
  M.setBaseOpacity=v=>{try{M.map.setPaintProperty('basemap-layer', 'raster-opacity',NB.clamp(v,0,1));}catch(e){}};
  M.setOsmOpacity =v=>{try{M.map.setPaintProperty('osm-layer',     'raster-opacity',NB.clamp(v,0,1));}catch(e){}};
  M.setOverlayVisibility=(layer,on)=>{
    if(!STORY_OVERLAYS[layer])return;
    overlayVisibleState[layer]=!!on;
    if(!M.map)return;
    const vis=on?'visible':'none';
    try{M.map.setLayoutProperty('story-fill-'+layer,'visibility',vis);}catch(e){}
    try{M.map.setLayoutProperty('story-hover-shadow-'+layer,'visibility',vis);}catch(e){}
    try{M.map.setLayoutProperty('story-hover-fill-'+layer,'visibility',vis);}catch(e){}
    try{M.map.setLayoutProperty('story-glow-'+layer,'visibility',vis);}catch(e){}
    try{M.map.setLayoutProperty('story-hover-lift-'+layer,'visibility',vis);}catch(e){}
    try{M.map.setLayoutProperty('story-line-'+layer,'visibility',vis);}catch(e){}
    if(on)applyOverlayBase(layer);
  };
  M.setOverlayOpacity=(layer,v)=>{
    const def=STORY_OVERLAYS[layer];
    if(!def)return;
    const op=NB.clamp(Number(v),0,1);
    overlayOpacityState[layer]=op;
    if(!M.map)return;
    applyOverlayBase(layer);
    try{M.map.setPaintProperty('story-line-'+layer,'line-opacity',def.lineOpacity*op);}catch(e){}
  };
  M.curOsm   =()=>null;
  M.setOsmMode=()=>true;
  M.setCamera=(pitch,bearing,animate=false)=>{
    const p=NB.clamp(Number(pitch),0,72);
    let b=Number(bearing);b=((b+540)%360)-180;
    M.cam.pitch=p;M.cam.bearing=b;
    if(!M.map)return;
    if(animate)M.map.easeTo({pitch:p,bearing:b,duration:500});
    else M.map.jumpTo({pitch:p,bearing:b});
    NB.bus.emit('map:moved');
  };
  M.flyHome=()=>{
    if(M.map)M.map.flyTo({center:CENTER,zoom:11,bearing:0,pitch:0,duration:1200});
  };
  M.zoom=d=>{if(M.map)d>0?M.map.zoomIn():M.map.zoomOut();};
  M.toPoint=latlng=>{
    if(!M.map||!latlng)return null;
    const lng=Array.isArray(latlng)?latlng[1]:(latlng.lng??latlng[1]);
    const lat=Array.isArray(latlng)?latlng[0]:(latlng.lat??latlng[0]);
    return M.map.project([lng,lat]);
  };
  M.layerFor=()=>null;
  M.applyOrder=keys=>{
    void keys;
    if(!M.map)return;
    /* DEM must stay visually above every other map layer regardless of panel row order. */
    try{M.map.moveLayer('osm-layer');}catch(e){}
    try{M.map.moveLayer('basemap-layer');}catch(e){}
    try{M.map.moveLayer('dem-layer');}catch(e){}
    Object.keys(STORY_OVERLAYS).forEach(layer=>{
      try{M.map.moveLayer('story-fill-'+layer);}catch(e){}
      try{M.map.moveLayer('story-hover-shadow-'+layer);}catch(e){}
      try{M.map.moveLayer('story-hover-fill-'+layer);}catch(e){}
      try{M.map.moveLayer('story-glow-'+layer);}catch(e){}
      try{M.map.moveLayer('story-hover-lift-'+layer);}catch(e){}
      try{M.map.moveLayer('story-line-'+layer);}catch(e){}
    });
    /* keep the invisible hover polygon above the rasters so inspect/hover still works */
    try{M.map.moveLayer('dem-area-fill');}catch(e){}
  };

})();