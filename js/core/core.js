/* Namespace, tiny DOM helpers, math, event bus, toast, drag utility.
   Every other module reads/writes window.NB — no other globals. */
(function(){
  'use strict';
  const NB = window.NB = window.NB || {};

  NB.$  = (s,c=document)=>c.querySelector(s);
  NB.$$ = (s,c=document)=>[...c.querySelectorAll(s)];

  NB.clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  NB.lerp=(a,b,t)=>a+(b-a)*t;
  NB.ease={
    outCubic:t=>1-Math.pow(1-t,3),
    inOut:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,
    outBack:t=>{const c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)},
    outElastic:t=>t===0?0:t===1?1:Math.pow(2,-10*t)*Math.sin((t*10-.75)*(2*Math.PI/3))+1
  };

  NB.reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* deterministic PRNG for procedural textures */
  NB.mulberry32=function(seed){
    let a=seed>>>0;
    return function(){
      a|=0;a=a+0x6D2B79F5|0;
      let t=Math.imul(a^a>>>15,1|a);
      t=t+Math.imul(t^t>>>7,61|t)^t;
      return((t^t>>>14)>>>0)/4294967296;
    };
  };

  /* micro event bus — modules talk only through this */
  const subs={};
  NB.bus={
    on(ev,fn){(subs[ev]=subs[ev]||[]).push(fn);return()=>NB.bus.off(ev,fn)},
    off(ev,fn){const l=subs[ev];if(!l)return;const i=l.indexOf(fn);if(i>-1)l.splice(i,1)},
    emit(ev,data){(subs[ev]||[]).slice().forEach(fn=>{try{fn(data)}catch(e){console.warn('[NB.bus]',ev,e)}})}
  };

  /* toast */
  let toastT;
  NB.toast=function(msg){
    const t=NB.$('#toast');if(!t)return;
    NB.$('#toastMsg').textContent=msg;t.classList.add('show');
    clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2200);
  };

  /* pointer-drag helper (ported) */
  NB.dragXY=function(el,onMove){
    if(!el)return;
    el.addEventListener('pointerdown',e=>{
      e.preventDefault();el.setPointerCapture(e.pointerId);
      const mv=ev=>onMove(ev),
            up=()=>{el.removeEventListener('pointermove',mv);el.removeEventListener('pointerup',up);el.removeEventListener('pointercancel',up)};
      el.addEventListener('pointermove',mv);el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);onMove(e);
    });
  };

  /* component mount helper — replaces <div id="nb-*"> with template HTML (supports multiple root nodes) */
  NB.mountComponent=function(id,html){
    const el=document.getElementById(id);
    if(!el)return;
    const t=document.createElement('template');
    t.innerHTML=html.trim();
    el.parentNode.insertBefore(t.content.cloneNode(true),el);
    el.remove();
  };
})();