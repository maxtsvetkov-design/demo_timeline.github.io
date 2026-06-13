/* Story panel: header actions, scroll-synced dots, slide copy,
   pointer tilt on cards, DEM compare slider. */
(function(){
  'use strict';
  const NB=window.NB,$=NB.$,$$=NB.$$;

  /* ---------- header actions ---------- */
  const cc=$('#copyCoords');
  if(cc)cc.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText('44.507123, 40.182983');}catch(_){/* sandboxed */}
    NB.toast('Coordinates copied');
  });
  const sb=$('#shareBtn');
  if(sb)sb.addEventListener('click',()=>NB.toast('Share link created · expires in 30 days'));

  $$('.pico').forEach(b=>b.addEventListener('click',()=>{
    const a=b.dataset.pico;
    if(a==='close'){
      $('#storyPanel').classList.add('hidden');NB.ui.syncStoryW();
      NB.toast('Story closed — reopen via the Story tab');
    }
    else if(a==='expand'){
      NB.ui.setWide(!NB.ui.isWide());
      NB.toast(NB.ui.isWide()?'Panel expanded':'Panel restored');
    }
    else if(a==='download')NB.toast('Exporting story as PDF…');
    else if(a==='send')NB.toast('Sent to project channel');
    else if(a==='more')NB.toast('More actions — duplicate, schedule, archive');
  }));

  /* ---------- slides + dots ---------- */
  const slides=[
   {t:'The canopy cover has increased by <b class="hl">12%</b>',
    b:'<strong>Area name</strong> is extremely flat, low-lying coastal terrain — the vast dominance of blue and green shows that almost the entire area sits within just a few metres of sea level. This makes it highly vulnerable to tidal inundation, sea-level rise and storm surge — and confirms why precise elevation data at millimetre resolution is critical.'},
   {t:'Standing biomass reached <b class="hl">145 t/ha</b> this season',
    b:'Twelve months of monitoring show steady accumulation through spring, followed by a sharp gain after the May planting cycle. The trajectory now sits <strong>29% above the restoration baseline</strong>, with the strongest growth concentrated along the sheltered inner channels of the polygon.'},
   {t:'Nursery habitat expanded by <b class="hl">8.5 ha</b>',
    b:'As pioneer mangroves stabilise the sediment, tidal creeks are deepening and branching. The newly sheltered shallows now function as fish-nursery habitat — an <strong>8% quarter-on-quarter gain</strong> in usable land cover across the monitored area.'}
  ];
  const dotsWrap=$('#dotsNav'),spScroll=$('.sp-scroll');
  /* all blocks that have data-section (value or empty) — order = DOM order */
  const sections=$$('[data-section]',spScroll);
  const SECTION_LAYER_MAP={
    overview:'dem',
    'area info':'liwa-meta',
    'land cover':'liwa-classif',
    'native fauna':'liwa-fauna',
    impact:'liwa-impact',
    'survival flow':'mgr-flow',
    classification:'area-time',
    'habitat health':'habitat',
    'data updates':'data-upd',
    biomass:'biomass',
    'veg & cover':'veg-cover',
    'dem compare':'dem-cmp'
  };
  function isSectionVisible(el){
    if(!el)return false;
    if(el.hidden)return false;
    const cs=getComputedStyle(el);
    if(cs.display==='none'||cs.visibility==='hidden')return false;
    return el.getClientRects().length>0;
  }
  function visibleStoryLayers(){
    return sections
      .filter(isSectionVisible)
      .map(sectionLayer)
      .filter(Boolean)
      .filter((layer,idx,arr)=>arr.indexOf(layer)===idx);
  }
  const dotEls=[];
  function scrollStoryToSection(section){
    if(!section||!spScroll)return;
    const hostRect=spScroll.getBoundingClientRect();
    const sectionRect=section.getBoundingClientRect();
    const top=spScroll.scrollTop+(sectionRect.top-hostRect.top)-6;
    spScroll.scrollTo({top:Math.max(0,top),behavior:'smooth'});
  }
  sections.forEach((s,i)=>{
    const label=s.dataset.label||s.dataset.section||('Section '+(i+1));
    const d=document.createElement('button');
    d.type='button';
    d.className='dot'+(i===0?' active':'');
    d.setAttribute('aria-label',label);
    d.setAttribute('data-tip',label);
    d.addEventListener('click',e=>{
      e.preventDefault();
      scrollStoryToSection(s);
    });
    dotsWrap.appendChild(d);dotEls.push(d);
  });

  function activateDot(idx){
    dotEls.forEach((d,i)=>d.classList.toggle('active',i===idx));
    if(idx===0){
      const s=slides[0],w=$('#slideWrap');
      w.classList.add('out');
      setTimeout(()=>{$('#slideTitle').innerHTML=s.t;$('#slideBody').innerHTML=s.b;w.classList.remove('out');},220);
    }
  }
  function sectionLayer(section){
    if(!section)return null;
    const explicit=(section.dataset.layer||'').trim();
    if(explicit)return explicit;
    const key=(section.dataset.label||section.dataset.section||'').trim().toLowerCase();
    return SECTION_LAYER_MAP[key]||null;
  }
  let activeSectionIndex=-1;
  function publishActiveSection(idx){
    if(idx===activeSectionIndex)return;
    activeSectionIndex=idx;
    const section=sections[idx];
    const visibleLayers=visibleStoryLayers();
    NB.bus.emit('story:active-section',{
      index:idx,
      label:section?(section.dataset.label||section.dataset.section||('Section '+(idx+1))):'',
      layer:sectionLayer(section),
      visibleLayers
    });
  }
  function updateDots(){
    const st=spScroll.scrollTop;
    const visibleSections=sections
      .map((s,i)=>({s,i}))
      .filter(x=>isSectionVisible(x.s));
    if(!visibleSections.length)return;

    let best=visibleSections[0].i;
    if(spScroll.scrollHeight-st-spScroll.clientHeight<8){
      best=visibleSections[visibleSections.length-1].i;
    }else{
      const anchor=st+spScroll.clientHeight*0.22;
      const rect=spScroll.getBoundingClientRect();
      let bestDist=Infinity;
      visibleSections.forEach(({s,i})=>{
        const top=s.getBoundingClientRect().top-rect.top+st;
        const dist=Math.abs(top-anchor);
        if(dist<bestDist){
          bestDist=dist;
          best=i;
        }
      });
    }
    activateDot(best);
    publishActiveSection(best);
  }
  spScroll.addEventListener('scroll',updateDots,{passive:true});
  updateDots();
  $('#slideBody').innerHTML=slides[0].b;

  /* ---------- info icons ---------- */
  $$('.info-i,[data-info]').forEach(el=>el.addEventListener('click',e=>{
    e.stopPropagation();
    const m=el.dataset.info||(el.closest('[data-info]')||{}).dataset?.info;
    if(m)NB.toast(m);
  }));

  /* ---------- card tilt ---------- */
  if(!NB.reduced){
    $$('.wcard').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const r=card.getBoundingClientRect();
        const rx=((e.clientY-r.top)/r.height-.5)*-2;
        const ry=((e.clientX-r.left)/r.width-.5)*2;
        card.style.transform='perspective(900px) rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg)';
      });
      card.addEventListener('pointerleave',()=>{card.style.transform='';});
    });
  }

  /* ---------- DEM compare ---------- */
  const cmp=$('#cmp');
  function cmpMove(e){
    const r=cmp.getBoundingClientRect();
    let p=((e.clientX-r.left)/r.width)*100;
    cmp.style.setProperty('--pos',NB.clamp(p,4,96)+'%');
  }
  NB.dragXY($('#cmpGrip'),cmpMove);
  NB.dragXY(cmp,e=>{if(e.target.closest('.cmp-tag'))return;cmpMove(e);});
  $$('.cmp-tag').forEach(t=>t.addEventListener('click',e=>{
    e.stopPropagation();NB.toast('Opening '+t.dataset.dem+' in Exploration');
  }));
})();