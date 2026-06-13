/* Canvas charts with scroll-triggered draw-in animation and responsive refit.
   NB.charts.register(sel, logicalHeight, drawFn(ctx,W,H,progress,extra), opts) */
(function(){
  'use strict';
  const NB=window.NB,$=NB.$;

  NB.charts={
    register(sel,logH,drawFn,opts={}){
      const cv=typeof sel==='string'?$(sel):sel;
      if(!cv)return null;
      const ctx=cv.getContext('2d');
      const state={p:0,done:false,extra:{hover:-1}};
      let W=420;
      function fit(){
        const r=cv.getBoundingClientRect();
        W=Math.max(60,r.width||420);
        const dpr=Math.max(1,window.devicePixelRatio||1);
        cv.width=Math.round(W*dpr);cv.height=Math.round(logH*dpr);
        ctx.setTransform(dpr,0,0,dpr,0,0);
      }
      function draw(){ctx.clearRect(0,0,W,logH);drawFn(ctx,W,logH,state.p,state.extra);}
      const api={canvas:cv,ctx,redraw:draw,state,width:()=>W};
      function animate(){
        const dur=opts.dur||1100,t0=performance.now();
        function step(t){
          state.p=NB.reduced?1:NB.clamp((t-t0)/dur,0,1);
          draw();
          if(state.p<1)requestAnimationFrame(step);
          else{state.done=true;if(opts.done)opts.done(api);}
        }
        requestAnimationFrame(step);
      }
      fit();draw();
      const io=new IntersectionObserver(es=>{
        es.forEach(en=>{if(en.isIntersecting){io.disconnect();animate();}});
      },{threshold:.3});
      io.observe(cv);
      if('ResizeObserver' in window)new ResizeObserver(()=>{fit();draw();}).observe(cv);
      return api;
    }
  };
  const E=NB.ease;
  function rr(ctx,x,y,w,h,r){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);}

  /* ════════ sankey · mangrove survival ════════ */
  NB.charts.register('#sankeyChart',200,(ctx,W,H,p)=>{
    const sx=W/420,T=46,SC=1.28;
    const st=[
      {x:18,w:7,label:['Propagules','planted'],v:100},
      {x:106,w:7,label:['Established'],v:72},
      {x:178,w:7,label:['Seedling'],v:55},
      {x:246,w:7,label:['Sapling'],v:43},
      {x:306,w:7,label:['Young','tree'],v:38},
      {x:374,w:7,label:['Mature','canopy'],v:34},
    ];
    const lossDef=[
      [{n:'Desiccation / heat',v:18,c:'rgba(218,82,52,.62)'},{n:'Tidal washout',v:10,c:'rgba(182,100,46,.55)'}],
      [{n:'Crab predation',v:9,c:'rgba(206,72,55,.6)'},{n:'Sediment burial',v:5,c:'rgba(160,90,50,.53)'},{n:'Storm / wave damage',v:3,c:'rgba(142,108,52,.46)'}],
      [{n:'Competition / shade',v:5,c:'rgba(198,74,56,.55)'},{n:'Disease',v:4,c:'rgba(164,86,50,.49)'},{n:'',v:3,c:'rgba(148,96,52,.43)'}],
      [{n:'Drought stress',v:2,c:'rgba(210,66,50,.56)'},{n:'Hydrology change',v:2,c:'rgba(178,86,46,.50)'},{n:'',v:1,c:'rgba(150,96,50,.42)'}],
      [{n:'Late mc',v:2,c:'rgba(196,72,52,.54)'},{n:'',v:2,c:'rgba(162,88,48,.46)'}],
    ];
    const X=v=>v*sx,B=i=>T+st[i].v*SC;

    ctx.fillStyle='#0d1511';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#3ce8a6';ctx.beginPath();ctx.arc(16,17,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#e8f4f0';ctx.font='600 11.5px "Inter Tight",sans-serif';ctx.textAlign='left';
    ctx.fillText('Total mangrove survived',28,21);

    /* clip-sweep reveal for the flow body */
    ctx.save();
    ctx.beginPath();ctx.rect(0,26,W*E.outCubic(p),H);ctx.clip();

    for(let i=0;i<st.length-1;i++){
      const x0=X(st[i].x)+st[i].w/2,x1=X(st[i+1].x)-st[i+1].w/2;
      const mx=(x0+x1)/2,b1=B(i+1),b0=B(i);
      const gg=ctx.createLinearGradient(x0,0,x1,0);
      gg.addColorStop(0,'rgba(60,232,166,.56)');gg.addColorStop(1,'rgba(48,208,148,.50)');
      ctx.beginPath();
      ctx.moveTo(x0,T);ctx.bezierCurveTo(mx,T,mx,T,x1,T);
      ctx.lineTo(x1,b1);ctx.bezierCurveTo(mx,b1,mx,b1,x0,b1);
      ctx.closePath();ctx.fillStyle=gg;ctx.fill();

      let ly=b1;
      for(let j=0;j<lossDef[i].length;j++){
        const ld=lossDef[i][j],lh=ld.v*SC,drop=14+j*10;
        const ly1=ly+drop,ly1b=Math.min(H+10,ly+lh+drop+4);
        const lfg=ctx.createLinearGradient(0,ly,0,Math.min(H,ly1b));
        lfg.addColorStop(0,ld.c);lfg.addColorStop(0.55,ld.c);
        lfg.addColorStop(1,ld.c.replace(/[\d.]+\)$/,'0)'));
        ctx.beginPath();
        ctx.moveTo(x0,ly);ctx.bezierCurveTo(mx,ly+drop*0.5,mx,ly1,x1,ly1);
        ctx.lineTo(x1,ly1b);ctx.bezierCurveTo(mx,ly+lh+drop*0.6,mx,ly+lh,x0,ly+lh);
        ctx.closePath();ctx.fillStyle=lfg;ctx.fill();
        if(ld.n){
          const tx=x0+(x1-x0)*0.38,ty=Math.min(H-4,(ly+(ly+lh))/2+drop*0.45);
          ctx.font='8.5px "Inter Tight",sans-serif';
          ctx.fillStyle='rgba(215,165,148,.72)';ctx.textAlign='center';
          ctx.fillText(ld.n,tx,ty);
        }
        ly+=lh;
      }
    }
    ctx.restore();

    /* stage nodes grow upward-from-top early in the timeline */
    const np=NB.clamp(p*1.45,0,1);
    for(let i=0;i<st.length;i++){
      const s=st[i],gx=X(s.x),bh=s.v*SC*E.outCubic(NB.clamp(np*1.2-i*.05,0,1));
      const ng=ctx.createLinearGradient(0,T,0,T+s.v*SC);
      ng.addColorStop(0,'#3ce8a6');ng.addColorStop(1,'rgba(38,190,125,.68)');
      ctx.fillStyle=ng;ctx.fillRect(gx-s.w/2,T,s.w,bh);
      if(np>.4){
        ctx.globalAlpha=NB.clamp((np-.4)/.4,0,1);
        ctx.font='9px "Inter Tight",sans-serif';ctx.fillStyle='rgba(190,218,205,.74)';ctx.textAlign='center';
        s.label.forEach((l,li)=>ctx.fillText(l,gx,T-4-(s.label.length-1-li)*10));
        ctx.globalAlpha=1;
      }
    }
  },{dur:1500});

  /* ════════ area classification ════════ */
  NB.charts.register('#areaChart',155,(ctx,W,H,p)=>{
    const sx=W/420,BAR_W=58*sx,BAR_H=108,BAR_T=8;
    const cols=[{x:38*sx,label:'Feb 2026'},{x:190*sx,label:'Jul 2026'},{x:342*sx,label:'Sep 2026'}];
    const props=[[0.34,0.30,0.36],[0.26,0.22,0.52],[0.20,0.18,0.62]];
    const clrs=['#2d6645','#3a8a5c','#3ce8a6'];
    const changes=[['','',''],['−8%','−8%','+8%'],['−8%','−8%','+8%']];
    const barY=(ci,band)=>{let y=BAR_T;for(let b=0;b<band;b++)y+=props[ci][b]*BAR_H;return y;};

    const bp=E.outCubic(NB.clamp(p/.55,0,1));       /* bars grow */
    const fp=NB.clamp((p-.5)/.5,0,1);               /* flows fade in */

    if(fp>0){
      ctx.globalAlpha=fp;
      for(let ci=0;ci<cols.length-1;ci++){
        const x0=cols[ci].x+BAR_W,x1=cols[ci+1].x,mx=(x0+x1)/2;
        for(let band=0;band<3;band++){
          const y0t=barY(ci,band),y0b=y0t+props[ci][band]*BAR_H;
          const y1t=barY(ci+1,band),y1b=y1t+props[ci+1][band]*BAR_H;
          const fg=ctx.createLinearGradient(x0,0,x1,0);
          fg.addColorStop(0,clrs[band]+'cc');fg.addColorStop(1,clrs[band]+'88');
          ctx.beginPath();
          ctx.moveTo(x0,y0t);ctx.bezierCurveTo(mx,y0t,mx,y1t,x1,y1t);
          ctx.lineTo(x1,y1b);ctx.bezierCurveTo(mx,y1b,mx,y0b,x0,y0b);
          ctx.closePath();ctx.fillStyle=fg;ctx.fill();
        }
      }
      ctx.globalAlpha=1;
    }

    for(let ci=0;ci<cols.length;ci++){
      const cx=cols[ci].x;
      const colP=E.outCubic(NB.clamp(bp*1.3-ci*.15,0,1));
      let yOff=BAR_T;
      for(let band=0;band<3;band++){
        const full=props[ci][band]*BAR_H,bh=full*colP;
        ctx.fillStyle=clrs[band];
        ctx.fillRect(cx,yOff+(full-bh),BAR_W,bh);
        yOff+=full;
      }
      ctx.globalAlpha=colP;
      ctx.font='10.5px "Inter Tight",sans-serif';ctx.fillStyle='rgba(140,170,155,.6)';ctx.textAlign='center';
      ctx.fillText(cols[ci].label,cx+BAR_W/2,BAR_T+BAR_H+15);
      ctx.globalAlpha=1;

      if(ci===0&&colP>.6){
        ctx.globalAlpha=(colP-.6)/.4;
        for(let band=0;band<3;band++){
          const midY=barY(ci,band)+props[ci][band]*BAR_H/2;
          ctx.font='10px "Inter Tight",sans-serif';ctx.fillStyle='rgba(220,240,232,.8)';ctx.textAlign='right';
          ctx.fillText('4.53 ha',cx-5,midY+3.5);
        }
        ctx.globalAlpha=1;
      }
      if(ci>0&&fp>.4){
        ctx.globalAlpha=(fp-.4)/.6;
        for(let band=0;band<3;band++){
          const midY=barY(ci,band)+props[ci][band]*BAR_H/2;
          const ch=changes[ci][band];if(!ch)continue;
          const isPos=ch.startsWith('+');
          const bw=34,bh2=16,bx=cx+BAR_W+4,by=midY-bh2/2;
          ctx.fillStyle=isPos?'rgba(11,30,20,.88)':'rgba(30,12,12,.88)';
          rr(ctx,bx,by,bw,bh2,4);ctx.fill();
          ctx.strokeStyle=isPos?'rgba(60,232,166,.35)':'rgba(220,80,60,.35)';ctx.lineWidth=1;ctx.stroke();
          ctx.fillStyle=isPos?'#3ce8a6':'#e05040';
          ctx.font='bold 9.5px "JetBrains Mono",monospace';ctx.textAlign='center';
          ctx.fillText(ch,bx+bw/2,by+11.5);
        }
        ctx.globalAlpha=1;
      }
    }
  },{dur:1400});
})();