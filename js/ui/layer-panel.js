/* Layer panel module: menu add/remove, visibility toggles, per-layer opacity,
   drag reorder, and timeline track sync. Keeps UI concerns separate from core timeline playback logic. */
(function(){
  'use strict';
  const NB=window.NB;
  if(!NB)return;
  const $=NB.$,$$=NB.$$;

  const EXTRA_LAYERS={
    moisture:{title:'Soil moisture',sub:'SAR composite',swClass:'moisture',trackClass:'moisture-track',trackTint:'rgba(106,156,255,.16)'},
    canopy:{title:'Canopy height',sub:'Photogrammetry',swClass:'canopy',trackClass:'canopy-track',trackTint:'rgba(124,255,174,.14)'},
    tidal:{title:'Tidal extent',sub:'Hydrology model',swClass:'tidal',trackClass:'tidal-track',trackTint:'rgba(142,214,255,.14)'},
    /* story panel sections */
    'liwa-meta':{title:'Liwa area info',sub:'Site metadata',swClass:'liwa-meta',trackClass:'liwa-meta-track',trackTint:'rgba(220,170,100,.14)'},
    'liwa-classif':{title:'Area classification insights',sub:'Land cover · Jan 2024',swClass:'liwa-classif',trackClass:'liwa-classif-track',trackTint:'rgba(100,200,80,.14)'},
    'liwa-fauna':{title:'Native fauna survey',sub:'Field observations',swClass:'liwa-fauna',trackClass:'liwa-fauna-track',trackTint:'rgba(255,160,60,.14)'},
    'liwa-impact':{title:'Impact classification',sub:'Ground survey',swClass:'liwa-impact',trackClass:'liwa-impact-track',trackTint:'rgba(255,100,80,.14)'},
    'mgr-flow':{title:'Mangrove survival flow',sub:'Sankey · propagule → canopy',swClass:'mgr-flow',trackClass:'mgr-flow-track',trackTint:'rgba(60,200,170,.14)'},
    'area-time':{title:'Area classification over time',sub:'Satellite 10 m',swClass:'area-time',trackClass:'area-time-track',trackTint:'rgba(160,100,255,.14)'},
    habitat:{title:'Habitat health index',sub:'Composite score',swClass:'habitat',trackClass:'habitat-track',trackTint:'rgba(120,220,80,.14)'},
    'data-upd':{title:'Data update per project',sub:'Survey events',swClass:'data-upd',trackClass:'data-upd-track',trackTint:'rgba(80,150,255,.14)'},
    biomass:{title:'Total biomass growth',sub:'Above-ground · t/ha',swClass:'biomass',trackClass:'biomass-track',trackTint:'rgba(50,180,60,.14)'},
    'veg-cover':{title:'Vegetation & cover',sub:'NDVI + land cover',swClass:'veg-cover',trackClass:'veg-cover-track',trackTint:'rgba(40,220,140,.14)'},
    'dem-cmp':{title:'Elevation model comparison',sub:'DEM A vs DEM B',swClass:'dem-cmp',trackClass:'dem-cmp-track',trackTint:'rgba(100,130,200,.14)'}
  };
  const STORY_SECTION_LAYERS=[
    'liwa-meta','liwa-classif','liwa-fauna','liwa-impact','mgr-flow',
    'area-time','habitat','data-upd','biomass','veg-cover','dem-cmp'
  ];

  function makeOpacityControl(layer,initial){
    const wrap=document.createElement('div');
    wrap.className='layer-opacity-wrap';
    wrap.innerHTML='\n      <label class="layer-opacity-lbl" for="op-'+layer+'">Opacity</label>\n      <input class="layer-opacity" id="op-'+layer+'" type="range" min="0" max="100" value="'+Math.round(initial*100)+'" style="--fill:'+Math.round(initial*100)+'%">\n    ';
    return wrap;
  }

  function ensureRowShell(row){
    if(!row||row.querySelector('.layer-row-head'))return row;
    const bodyExisting=row.querySelector('.layer-opacity-wrap');
    const children=[...row.childNodes];
    const head=document.createElement('div');
    head.className='layer-row-head';
    const body=document.createElement('div');
    body.className='layer-row-body';
    row.textContent='';
    children.forEach(node=>{
      if(node===bodyExisting)body.appendChild(node);
      else head.appendChild(node);
    });
    row.appendChild(head);
    row.appendChild(body);
    row.classList.remove('is-open');
    row.setAttribute('aria-expanded','false');
    return row;
  }

  function buildExtraRow(layer,def){
    const row=document.createElement('div');
    row.className='layer-row layer-row-extra';
    row.dataset.layer=layer;
    row.draggable=true;
    row.innerHTML='\n      <span class="layer-drag-handle" data-tip="Drag to reorder"><svg class="icon sm"><use href="#i-grab"/></svg></span>\n      <button class="eye-t" data-role="collapse" data-tip="Collapse row"><svg class="icon xs"><use href="#i-chev-down"/></svg></button>\n      <span class="sw '+def.swClass+'"></span>\n      <span class="lname" style="display:block">'+def.title+'<small>'+def.sub+'</small></span>\n      <button class="eye-t on" data-role="visibility" data-tip="Toggle visibility"><svg class="icon sm"><use href="#i-eye"/></svg></button>\n      <button class="dots-t" data-role="remove" data-tip="Remove from panel"><svg class="icon sm"><use href="#i-close"/></svg></button>\n    ';
    return row;
  }

  function buildExtraTrack(layer,def){
    const track=document.createElement('div');
    track.className='track extra-track '+def.trackClass;
    track.dataset.trackLayer=layer;
    track.style.setProperty('--track-tint',def.trackTint);
    track.innerHTML='<div class="gridlines"></div>';
    return track;
  }

  NB.layerPanel={
    init(opts){
      const labels=$('#tlLabels'),tracksEl=$('#tracks'),menu=$('#layersMenu'),addBtn=$('#addLayers');
      if(!labels||!tracksEl||!menu||!addBtn)return;

      /* Teleport menu to body so no ancestor overflow:hidden or backdrop-filter can clip it */
      document.body.appendChild(menu);

      const rowState={};
      let dragSrc=null;

      const setEyeIcon=(row,on)=>{
        const vis=row.querySelector('[data-role="visibility"]') || row.querySelector('#eyeNdvi,#eyeBase,#eyeOsm');
        if(!vis)return;
        vis.classList.toggle('on',!!on);
        const use=vis.querySelector('use');
        if(use)use.setAttribute('href',on?'#i-eye':'#i-eye-off');
      };

      const syncTrackOrder=()=>{
        const rows=$$('.layer-row',labels);
        const ph=tracksEl.querySelector('#playhead');
        rows.forEach(row=>{
          const track=tracksEl.querySelector('.track[data-track-layer="'+row.dataset.layer+'"]');
          if(track&&ph)tracksEl.insertBefore(track,ph);
        });
        if(opts.onOrderChange)opts.onOrderChange(rows.map(r=>r.dataset.layer));
      };

      const wireDrag=(row)=>{
        row.addEventListener('dragstart',e=>{
          dragSrc=row;
          row.classList.add('dragging');
          e.dataTransfer.effectAllowed='move';
          e.dataTransfer.setData('text/plain',row.dataset.layer);
        });
        row.addEventListener('dragend',()=>{
          row.classList.remove('dragging');
          $$('.layer-row',labels).forEach(r=>r.classList.remove('drag-over'));
        });
        row.addEventListener('dragover',e=>{
          e.preventDefault();
          e.dataTransfer.dropEffect='move';
          if(dragSrc&&dragSrc!==row)row.classList.add('drag-over');
        });
        row.addEventListener('dragleave',()=>row.classList.remove('drag-over'));
        row.addEventListener('drop',e=>{
          e.preventDefault();
          row.classList.remove('drag-over');
          if(!dragSrc||dragSrc===row)return;
          const rows=$$('.layer-row',labels);
          const si=rows.indexOf(dragSrc),ti=rows.indexOf(row);
          if(si<ti)row.after(dragSrc);else row.before(dragSrc);
          syncTrackOrder();
          NB.toast('Layer order updated');
        });
      };

      const attachOpacity=(row,layer,initial=1)=>{
        ensureRowShell(row);
        const body=row.querySelector('.layer-row-body');
        let wrap=row.querySelector('.layer-opacity-wrap');
        if(!wrap){
          wrap=makeOpacityControl(layer,initial);
          body.appendChild(wrap);
        }else if(wrap.parentElement!==body){
          body.appendChild(wrap);
        }
        const slider=wrap.querySelector('.layer-opacity');
        slider.value=String(Math.round(initial*100));
        slider.style.setProperty('--fill',slider.value+'%');
        if(slider.dataset.bound==='1')return;
        slider.dataset.bound='1';
        slider.addEventListener('input',()=>{
          slider.style.setProperty('--fill',slider.value+'%');
          const v=Number(slider.value||100)/100;
          if(opts.setLayerOpacity)opts.setLayerOpacity(layer,v);
          const track=tracksEl.querySelector('.track[data-track-layer="'+layer+'"]');
          if(track)track.style.opacity=String(v);
        });
      };

      const setRowOpen=(row,on)=>{
        if(!row)return;
        row.classList.toggle('is-open',!!on);
        row.setAttribute('aria-expanded',on?'true':'false');
        const collapse=row.querySelector('[data-role="collapse"]') || row.querySelector('.eye-t');
        if(collapse)collapse.setAttribute('data-tip',on?'Collapse settings':'Expand settings');
      };

      const toggleExtra=(layer,on)=>{
        const mi=menu.querySelector('.lm-item[data-layer="'+layer+'"]');
        const has=!!labels.querySelector('.layer-row[data-layer="'+layer+'"]');
        const def=EXTRA_LAYERS[layer];
        if(!def)return;

        if(on&&!has){
          const row=buildExtraRow(layer,def);
          const track=buildExtraTrack(layer,def);
          labels.appendChild(row);
          tracksEl.insertBefore(track,tracksEl.querySelector('#playhead'));
          ensureRowShell(row);
          wireDrag(row);
          attachOpacity(row,layer,.8);
          bindRowUi(row,layer,true);
          setEyeIcon(row,true);
          setRowOpen(row,false);
          if(opts.setLayerVisible)opts.setLayerVisible(layer,true);
          if(opts.setLayerOpacity)opts.setLayerOpacity(layer,.8);
        }
        if(!on&&has){
          const row=labels.querySelector('.layer-row[data-layer="'+layer+'"]');
          const track=tracksEl.querySelector('.track[data-track-layer="'+layer+'"]');
          if(row)row.remove();
          if(track)track.remove();
          if(opts.setLayerVisible)opts.setLayerVisible(layer,false);
        }
        if(mi){mi.classList.toggle('on',!!on);mi.setAttribute('aria-selected',String(!!on));}
        syncTrackOrder();
      };

      const clearStoryFocus=()=>{
        STORY_SECTION_LAYERS.forEach(layer=>{
          const row=labels.querySelector('.layer-row[data-layer="'+layer+'"]');
          const track=tracksEl.querySelector('.track[data-track-layer="'+layer+'"]');
          if(row)row.classList.remove('story-focus','story-dim');
          if(track)track.classList.remove('story-focus','story-dim');
        });
      };

      const removeHiddenStoryLayers=(visibleLayers)=>{
        const keep=new Set((visibleLayers||[]).filter(layer=>STORY_SECTION_LAYERS.indexOf(layer)>-1));
        STORY_SECTION_LAYERS.forEach(layer=>{
          if(keep.has(layer))return;
          if(!labels.querySelector('.layer-row[data-layer="'+layer+'"]'))return;
          rowState[layer]=false;
          toggleExtra(layer,false);
        });
      };

      const applyStoryFocus=(activeLayer,visibleLayers)=>{
        removeHiddenStoryLayers(visibleLayers);
        const isActiveStoryLayer=activeLayer&&STORY_SECTION_LAYERS.indexOf(activeLayer)>-1;
        const isAllowed=(visibleLayers||[]).indexOf(activeLayer)>-1;

        STORY_SECTION_LAYERS.forEach(layer=>{
          const row=labels.querySelector('.layer-row[data-layer="'+layer+'"]');
          const track=tracksEl.querySelector('.track[data-track-layer="'+layer+'"]');
          const shouldBeOnlyOne=isActiveStoryLayer&&isAllowed&&layer===activeLayer;

          if(shouldBeOnlyOne){
            if(!row){
              rowState[layer]=true;
              toggleExtra(layer,true);
            }
            const rowNow=labels.querySelector('.layer-row[data-layer="'+layer+'"]');
            const trackNow=tracksEl.querySelector('.track[data-track-layer="'+layer+'"]');
            const slider=rowNow?rowNow.querySelector('.layer-opacity'):null;
            const base=NB.clamp(Number(slider?slider.value:80)/100,0,1);
            rowState[layer]=true;
            if(opts.setLayerVisible)opts.setLayerVisible(layer,true);
            if(opts.setLayerOpacity)opts.setLayerOpacity(layer,base);
            if(rowNow){
              setEyeIcon(rowNow,true);
              rowNow.classList.add('story-focus');
              rowNow.classList.remove('story-dim');
            }
            if(trackNow){
              trackNow.classList.remove('off','story-dim');
              trackNow.classList.add('story-focus');
            }
          }else{
            if(row){
              rowState[layer]=false;
              toggleExtra(layer,false);
            }
            if(track){
              track.classList.remove('story-focus','story-dim','off');
            }
          }
        });

        if(!isActiveStoryLayer||!isAllowed)clearStoryFocus();
        updateBadge();
      };

      const bindRowUi=(row,layer,isExtra)=>{
        ensureRowShell(row);
        const collapse=row.querySelector('[data-role="collapse"]') || row.querySelector('.eye-t');
        if(collapse){
          collapse.setAttribute('data-role','collapse');
          collapse.addEventListener('click',e=>{
            e.stopPropagation();
            setRowOpen(row,!row.classList.contains('is-open'));
          });
        }

        const vis=row.querySelector('[data-role="visibility"]') || row.querySelector('#eyeNdvi,#eyeBase,#eyeOsm');
        if(vis)vis.addEventListener('click',()=>{
          const prev=rowState[layer]!==false;
          const next=!prev;
          rowState[layer]=next;
          setEyeIcon(row,next);

          if(layer==='dem')opts.setNdvi(next);
          else if(layer==='basemap')opts.setBase(next);
          else if(layer==='osm')opts.setOsm(next);
          else {
            if(opts.setLayerVisible)opts.setLayerVisible(layer,next);
            const track=tracksEl.querySelector('.track[data-track-layer="'+layer+'"]');
            if(track)track.classList.toggle('off',!next);
          }

          const mi=menu.querySelector('.lm-item[data-layer="'+layer+'"]');
          if(mi){mi.classList.toggle('on',next);mi.setAttribute('aria-selected',String(next));}
          NB.toast(next?(isExtra?EXTRA_LAYERS[layer].title+' shown':'Layer shown'):(isExtra?EXTRA_LAYERS[layer].title+' hidden':'Layer hidden'));
        });

        const dots=row.querySelector('[data-role="remove"]') || row.querySelector('.dots-t');
        if(dots){
          dots.addEventListener('click',()=>{
            if(isExtra){
              rowState[layer]=false;
              toggleExtra(layer,false);
              NB.toast('Removed: '+EXTRA_LAYERS[layer].title);
              return;
            }
            NB.toast('Layer options — rename, style, export, remove');
          });
        }
      };

      /* core rows */
      const demRow=labels.querySelector('.layer-row[data-layer="dem"]');
      const baseRow=labels.querySelector('.layer-row[data-layer="basemap"]');
      const osmRow=labels.querySelector('.layer-row[data-layer="osm"]');

      if(demRow){rowState.dem=true;ensureRowShell(demRow);wireDrag(demRow);attachOpacity(demRow,'dem',1);bindRowUi(demRow,'dem',false);setRowOpen(demRow,false);}
      if(baseRow){rowState.basemap=true;ensureRowShell(baseRow);wireDrag(baseRow);attachOpacity(baseRow,'basemap',1);bindRowUi(baseRow,'basemap',false);setRowOpen(baseRow,false);}
      if(osmRow){rowState.osm=true;ensureRowShell(osmRow);wireDrag(osmRow);attachOpacity(osmRow,'osm',1);bindRowUi(osmRow,'osm',false);setRowOpen(osmRow,false);}

      /* ── layer menu ── */
      const lmSearch=menu.querySelector('#lmSearch');
      const lmClearQ=menu.querySelector('#lmClearQ');
      const lmBadge=menu.querySelector('#lmBadge');
      const lmEmpty=menu.querySelector('#lmEmpty');
      const lmList=menu.querySelector('#lmList');

      const updateBadge=()=>{
        const on=$$('.lm-item.on',menu).length;
        const total=$$('.lm-item',menu).length;
        if(lmBadge)lmBadge.textContent=on+' / '+total;
      };

      const filterMenu=(q)=>{
        const ql=q.toLowerCase().trim();
        let visible=0;
        $$('.lm-item',lmList).forEach(item=>{
          const txt=(item.querySelector('.lm-lbl')?.textContent||'').toLowerCase();
          const match=!ql||txt.includes(ql);
          item.style.display=match?'':'none';
          if(match)visible++;
        });
        $$('.lm-group-hd',lmList).forEach(hd=>{
          let sib=hd.nextElementSibling,hasVis=false;
          while(sib&&!sib.classList.contains('lm-group-hd')){
            if(sib.style.display!=='none')hasVis=true;
            sib=sib.nextElementSibling;
          }
          hd.style.display=hasVis?'':'none';
        });
        if(lmEmpty)lmEmpty.style.display=visible===0&&ql?'block':'none';
        if(lmClearQ)lmClearQ.style.display=ql?'flex':'none';
      };

      const openMenu=()=>{
        /* position panel above the Add Layers button using fixed coords */
        const br=addBtn.getBoundingClientRect();
        menu.style.left=br.left+'px';
        menu.style.bottom=(window.innerHeight-br.top+8)+'px';
        menu.style.top='';
        menu.classList.add('open');updateBadge();
        if(lmSearch){lmSearch.value='';filterMenu('');setTimeout(()=>lmSearch.focus(),60);}
      };
      const closeMenu=()=>{
        menu.classList.remove('open');
        if(lmSearch){lmSearch.value='';filterMenu('');}
      };

      addBtn.addEventListener('click',e=>{
        e.stopPropagation();
        menu.classList.contains('open')?closeMenu():openMenu();
      });
      document.addEventListener('click',e=>{
        if(!e.target.closest('#layersMenu,#addLayers'))closeMenu();
      });

      const lmClose=menu.querySelector('#lmClose');
      if(lmClose)lmClose.addEventListener('click',e=>{e.stopPropagation();closeMenu();});

      if(lmSearch)lmSearch.addEventListener('input',()=>filterMenu(lmSearch.value));
      if(lmClearQ)lmClearQ.addEventListener('click',e=>{
        e.stopPropagation();lmSearch.value='';filterMenu('');lmSearch.focus();
      });

      const lmSelAll=menu.querySelector('#lmSelAll');
      if(lmSelAll)lmSelAll.addEventListener('click',e=>{
        e.stopPropagation();
        $$('.lm-item:not(.lm-core)',lmList).forEach(item=>{
          if(item.style.display==='none')return;
          const layer=item.dataset.layer;
          if(!item.classList.contains('on')){
            item.classList.add('on');item.setAttribute('aria-selected','true');
            rowState[layer]=true;toggleExtra(layer,true);
          }
        });
        updateBadge();NB.toast('All visible layers added');
      });

      const lmDesel=menu.querySelector('#lmDesel');
      if(lmDesel)lmDesel.addEventListener('click',e=>{
        e.stopPropagation();
        $$('.lm-item:not(.lm-core)',lmList).forEach(item=>{
          if(!item.classList.contains('on'))return;
          const layer=item.dataset.layer;
          item.classList.remove('on');item.setAttribute('aria-selected','false');
          rowState[layer]=false;toggleExtra(layer,false);
        });
        updateBadge();NB.toast('Extra layers cleared');
      });

      const lmReset=menu.querySelector('#lmReset');
      if(lmReset)lmReset.addEventListener('click',e=>{
        e.stopPropagation();
        rowState.dem=true;rowState.basemap=true;rowState.osm=true;
        if(opts.setNdvi)opts.setNdvi(true);
        if(opts.setBase)opts.setBase(true);
        if(opts.setOsm)opts.setOsm(true);
        $$('.lm-item:not(.lm-core)',lmList).forEach(item=>{
          if(!item.classList.contains('on'))return;
          const layer=item.dataset.layer;
          item.classList.remove('on');item.setAttribute('aria-selected','false');
          rowState[layer]=false;toggleExtra(layer,false);
        });
        updateBadge();NB.toast('Layers reset to defaults');
      });

      $$('.lm-item',menu).forEach(item=>item.addEventListener('click',e=>{
        e.stopPropagation();
        const layer=item.dataset.layer;
        const next=!item.classList.contains('on');
        item.classList.toggle('on',next);item.setAttribute('aria-selected',String(next));
        rowState[layer]=next;
        if(item.classList.contains('lm-core')){
          if(layer==='dem')opts.setNdvi(next);
          else if(layer==='basemap')opts.setBase(next);
          else if(layer==='osm')opts.setOsm(next);
        }else{
          toggleExtra(layer,next);
        }
        updateBadge();
        if(item.classList.contains('lm-core'))NB.toast((next?'Shown: ':'Hidden: ')+(item.querySelector('.lm-lbl')?.childNodes[0]?.textContent?.trim()||layer));
        else NB.toast((next?'Added: ':'Removed: ')+EXTRA_LAYERS[layer].title);
      }));

      $$('.lm-item',menu).forEach(item=>item.addEventListener('keydown',e=>{
        if(e.key===' '||e.key==='Enter'){e.preventDefault();item.click();}
        if(e.key==='Escape'){e.preventDefault();closeMenu();addBtn.focus();}
        if(e.key==='ArrowDown'||e.key==='ArrowUp'){
          e.preventDefault();
          const all=[...$$('.lm-item',lmList)].filter(i=>i.style.display!=='none');
          const idx=all.indexOf(item);
          const tgt=e.key==='ArrowDown'?all[idx+1]:all[idx-1];
          if(tgt)tgt.focus();
        }
      }));

      syncTrackOrder();

      NB.bus.on('story:active-section',payload=>{
        applyStoryFocus((payload&&payload.layer)||'',(payload&&payload.visibleLayers)||[]);
      });

      this.setLayerState=(layer,on)=>{
        rowState[layer]=on;
        const row=labels.querySelector('.layer-row[data-layer="'+layer+'"]');
        if(row)setEyeIcon(row,on);
        const mi=menu.querySelector('.lm-item[data-layer="'+layer+'"]');
        if(mi){mi.classList.toggle('on',!!on);mi.setAttribute('aria-selected',String(!!on));}
      };

      this.resetDynamic=()=>{
        Object.keys(EXTRA_LAYERS).forEach(layer=>toggleExtra(layer,false));
      };
    }
  };
})();
