/* Radar, bubble and biomass charts (animated + hover). */
(function(){
  'use strict';
  const NB=window.NB,$=NB.$,E=NB.ease;
  function rr(ctx,x,y,w,h,r){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);}

  /* ════════ radar · habitat health ════════ */
  NB.charts.register('#radarChart',190,(ctx,W,H,p)=>{
    const cx=W/2+8,cy=H/2+4,R=Math.min(68,W*.32);
    const axes=[
      {label:'Water Quality',v:78},
      {label:'Biodiversity',v:55},
      {label:'Vegetation',v:68},
      {label:'Soil Health',v:48},
      {label:'Air Quality',v:62},
    ];
    const N=axes.length;
    const ang=i=>-Math.PI/2+(2*Math.PI/N)*i;
    const pt=(i,r)=>[cx+r*Math.cos(ang(i)),cy+r*Math.sin(ang(i))];

    [25,50,75,100].forEach((pct,gi)=>{
      const r=R*(pct/100);
      ctx.beginPath();
      for(let i=0;i<N;i++){const[x,y]=pt(i,r);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
      ctx.closePath();
      ctx.strokeStyle=gi===3?'rgba(60,232,166,.18)':'rgba(255,255,255,.07)';
      ctx.lineWidth=1;ctx.stroke();
      ctx.font='8.5px "JetBrains Mono",monospace';ctx.fillStyle='rgba(130,160,145,.45)';ctx.textAlign='center';
      ctx.fillText(String(pct),cx+3,cy-r+3.5);
    });
    for(let i=0;i<N;i++){
      const[x,y]=pt(i,R);
      ctx.strokeStyle='rgba(255,255,255,.1)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();
    }

    const rp=E.outBack(NB.clamp(p/.75,0,1));
    ctx.beginPath();
    for(let i=0;i<N;i++){const[x,y]=pt(i,R*axes[i].v/100*rp);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.closePath();
    const fg=ctx.createRadialGradient(cx,cy,0,cx,cy,R);
    fg.addColorStop(0,'rgba(60,232,166,.38)');fg.addColorStop(1,'rgba(40,180,140,.12)');
    ctx.fillStyle=fg;ctx.fill();
    ctx.strokeStyle='rgba(60,232,166,.7)';ctx.lineWidth=1.5;ctx.stroke();

    for(let i=0;i<N;i++){
      const dp=NB.clamp((p-.55-i*.07)/.25,0,1);
      if(dp<=0)continue;
      const[x,y]=pt(i,R*axes[i].v/100*rp);
      ctx.beginPath();ctx.arc(x,y,3*E.outBack(dp),0,Math.PI*2);
      ctx.fillStyle='#3ce8a6';ctx.fill();
      ctx.strokeStyle='#0c1912';ctx.lineWidth=1.5;ctx.stroke();
    }

    ctx.globalAlpha=NB.clamp(p*2,0,1);
    ctx.font='10px "Inter Tight",sans-serif';ctx.fillStyle='rgba(195,220,210,.8)';
    axes.forEach((ax,i)=>{
      const[x,y]=pt(i,R+16);
      const offX=i===0||i===4?-2:i===1?2:i===2?2:-2;
      ctx.textAlign=i===0?'center':x>cx+5?'left':x<cx-5?'right':'center';
      ctx.fillText(ax.label,x+offX,y+(i===0?-2:i>=3?4:0));
    });
    ctx.globalAlpha=1;
  },{dur:1300});

  /* ════════ bubble · data updates ════════ */
  NB.charts.register('#bubbleChart',185,(ctx,W,H,p)=>{
    const L=108,R=14,T=8,B=32;
    const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov'];
    const mLabels=[0,2,4,5,8,10];
    const projNames=['Long_project_name_1','Long_project_name_2','Project 3','Project 4','Project 5'];
    const projClrs=['rgba(74,144,217,.82)','rgba(196,146,26,.82)','rgba(192,64,128,.82)','rgba(60,184,166,.82)','rgba(196,188,32,.82)'];
    const rows=5,rowH=(H-T-B)/rows;
    const mX=m=>L+m*(W-L-R)/10;
    const rY=r=>T+r*rowH+rowH/2;
    const bubbles=[
      [0,0,7],[0,0,9],[0,1,8],[0,1,6],[0,2,9],[0,2,7],[0,3,11],[0,4,8],[0,5,9],[0,6,7],[0,7,6],[0,8,8],[0,9,7],[0,10,6],
      [1,0,11],[1,0,9],[1,1,13],[1,1,10],[1,2,15],[1,2,11],[1,3,17],[1,4,13],[1,4,10],[1,5,14],[1,6,11],[1,7,10],[1,8,9],[1,9,8],[1,10,7],
      [2,1,7],[2,3,9],[2,4,11],[2,5,8],[2,6,7],[2,7,6],[2,8,7],[2,9,8],[2,10,7],
      [3,3,6],[3,5,7],[3,7,9],[3,8,13],[3,9,11],[3,10,15],
      [4,0,7],[4,1,8],[4,2,6],[4,3,9],[4,4,7],[4,5,8],[4,6,6],[4,7,7],[4,8,8],[4,9,9],[4,10,10],
    ];

    ctx.font='10px "Inter Tight",sans-serif';ctx.fillStyle='rgba(140,165,155,.65)';ctx.textAlign='right';
    projNames.forEach((n,r)=>ctx.fillText(n,L-6,rY(r)+3.5));
    ctx.font='10.5px "Inter Tight",sans-serif';ctx.fillStyle='rgba(130,158,148,.55)';ctx.textAlign='center';
    mLabels.forEach(m=>ctx.fillText(months[m],mX(m),H-B+16));
    mLabels.forEach(m=>{
      ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(mX(m),T);ctx.lineTo(mX(m),H-B);ctx.stroke();
    });

    bubbles.forEach(([r,m,rad])=>{
      const start=m/10*.62,lp=NB.clamp((p-start)/.34,0,1);
      if(lp<=0)return;
      const k=E.outBack(lp),x=mX(m),y=rY(r);
      ctx.beginPath();ctx.arc(x,y,rad*k,0,Math.PI*2);
      ctx.fillStyle=projClrs[r];ctx.fill();
      ctx.beginPath();ctx.arc(x-rad*k*0.25,y-rad*k*0.3,rad*k*0.35,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,.15)';ctx.fill();
    });
  },{dur:1600});

  /* ════════ biomass · animated sweep + hover ════════ */
  (function(){
    const data=[40,46,50,56,60,63,68,86,104,152,138,145];
    const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const HGT=240,L=52,R=20,T=24,B=40,maxV=180;

    function drawBiomass(ctx,W,H,p,extra){
      const X=i=>L+i*(W-L-R)/(data.length-1);
      const Y=v=>T+(1-v/maxV)*(H-T-B);
      const pts=data.map((v,i)=>[X(i),Y(v)]);
      const hoverIdx=extra.hover;
      function spline(c,pp){
        c.beginPath();c.moveTo(pp[0][0],pp[0][1]);
        for(let i=0;i<pp.length-1;i++){
          const p0=pp[Math.max(0,i-1)],p1=pp[i],p2=pp[i+1],p3=pp[Math.min(pp.length-1,i+2)];
          c.bezierCurveTo(p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6,p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6,p2[0],p2[1]);
        }
      }
      const gA=NB.clamp(p*3,0,1);
      ctx.globalAlpha=gA;
      [0,80].forEach(v=>{ctx.fillStyle='rgba(255,255,255,0.016)';ctx.fillRect(L,Y(v+40),W-L-R,Y(v)-Y(v+40));});
      ctx.save();ctx.setLineDash([3,6]);ctx.lineWidth=1;
      [0,40,80,120,160].forEach(v=>{ctx.strokeStyle='rgba(60,232,166,0.1)';ctx.beginPath();ctx.moveTo(L,Y(v));ctx.lineTo(W-R,Y(v));ctx.stroke();});
      ctx.restore();
      ctx.font='bold 10px JetBrains Mono,monospace';ctx.textAlign='right';
      [0,40,80,120,160].forEach(v=>{ctx.fillStyle=v===160?'rgba(60,232,166,.7)':'rgba(130,158,148,.5)';ctx.fillText(String(v),L-10,Y(v)+3.5);});
      ctx.save();ctx.translate(13,H/2);ctx.rotate(-Math.PI/2);ctx.fillStyle='rgba(110,140,130,.4)';ctx.font='9.5px Inter Tight,sans-serif';ctx.textAlign='center';ctx.fillText('t / ha',0,0);ctx.restore();
      months.forEach((m,i)=>{ctx.fillStyle='rgba(100,130,120,.28)';ctx.fillRect(X(i),H-B+4,1,5);if([0,2,4,6,8,10,11].includes(i)){ctx.font=(i===11?'bold ':'')+' 10px Inter Tight,sans-serif';ctx.fillStyle=i===11?'rgba(60,232,166,.65)':'rgba(125,150,142,.55)';ctx.textAlign='center';ctx.fillText(m,X(i),H-B+18);}});
      ctx.globalAlpha=1;

      /* sweep clip */
      const sweep=L+(W-L-R)*E.inOut(p);
      ctx.save();
      ctx.beginPath();ctx.rect(0,0,sweep+2,H);ctx.clip();

      const g=ctx.createLinearGradient(0,T,0,H-B);g.addColorStop(0,'rgba(60,232,166,0.2)');g.addColorStop(0.55,'rgba(60,232,166,0.07)');g.addColorStop(1,'rgba(60,232,166,0)');
      spline(ctx,pts);ctx.lineTo(X(data.length-1),H-B);ctx.lineTo(X(0),H-B);ctx.closePath();ctx.fillStyle=g;ctx.fill();
      ctx.save();ctx.shadowColor='rgba(60,232,166,0.5)';ctx.shadowBlur=16;spline(ctx,pts);ctx.strokeStyle='rgba(60,232,166,0.3)';ctx.lineWidth=7;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();ctx.restore();
      spline(ctx,pts);ctx.strokeStyle='#3ce8a6';ctx.lineWidth=2.2;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();
      ctx.restore();

      /* leading comet head while sweeping */
      if(p<1){
        let li=0;
        for(let i=0;i<pts.length;i++)if(pts[i][0]<=sweep)li=i;
        const a=pts[li],b=pts[Math.min(pts.length-1,li+1)];
        const t2=b[0]===a[0]?0:NB.clamp((sweep-a[0])/(b[0]-a[0]),0,1);
        const hx=NB.lerp(a[0],b[0],t2),hy=NB.lerp(a[1],b[1],t2);
        ctx.save();ctx.shadowColor='rgba(120,255,205,.9)';ctx.shadowBlur=14;
        ctx.beginPath();ctx.arc(hx,hy,3.4,0,Math.PI*2);ctx.fillStyle='#bfffe2';ctx.fill();ctx.restore();
      }

      /* dots appear behind the sweep */
      pts.forEach(([x,y],i)=>{
        if(x>sweep)return;
        const last=i===data.length-1;
        ctx.beginPath();ctx.arc(x,y,last?5:2.8,0,Math.PI*2);
        ctx.fillStyle=last?'#3ce8a6':'rgba(60,232,166,.72)';ctx.fill();
        ctx.lineWidth=last?2.2:1.5;ctx.strokeStyle='#0c1912';ctx.stroke();
        if(last&&p>=1){ctx.beginPath();ctx.arc(x,y,9,0,Math.PI*2);ctx.strokeStyle='rgba(60,232,166,0.2)';ctx.lineWidth=2;ctx.stroke();}
      });

      /* peak callout */
      if(p>=1){
        const px=X(data.length-1),py=Y(data[data.length-1]),lw=64,lh=20,lx=px-lw-8,ly=py-lh/2;
        ctx.fillStyle='rgba(8,18,14,0.92)';rr(ctx,lx,ly,lw,lh,5);ctx.fill();
        ctx.strokeStyle='rgba(60,232,166,0.38)';ctx.lineWidth=1;ctx.stroke();
        ctx.fillStyle='#3ce8a6';ctx.font='bold 11px JetBrains Mono,monospace';ctx.textAlign='center';
        ctx.fillText('145 t/ha',lx+lw/2,ly+13.5);
      }

      /* hover cursor */
      if(hoverIdx>=0&&p>=1){
        const hx=X(hoverIdx),hy=Y(data[hoverIdx]);
        ctx.save();ctx.strokeStyle='rgba(60,232,166,0.5)';ctx.lineWidth=1;ctx.setLineDash([]);
        ctx.beginPath();ctx.moveTo(hx,T);ctx.lineTo(hx,H-B);ctx.stroke();ctx.restore();
        ctx.beginPath();ctx.arc(hx,hy,5,0,Math.PI*2);ctx.fillStyle='#3ce8a6';ctx.fill();
        ctx.lineWidth=2;ctx.strokeStyle='#0c1912';ctx.stroke();
        ctx.save();ctx.shadowColor='rgba(60,232,166,0.6)';ctx.shadowBlur=10;
        ctx.beginPath();ctx.arc(hx,hy,5,0,Math.PI*2);ctx.fillStyle='#3ce8a6';ctx.fill();ctx.restore();
      }
    }

    const api=NB.charts.register('#biomassChart',HGT,drawBiomass,{
      dur:1700,
      done(api){
        const cv=api.canvas,tip=$('#chartTip');
        cv.addEventListener('pointermove',e=>{
          const r=cv.getBoundingClientRect(),W=api.width();
          const sxp=(e.clientX-r.left);
          let idx=Math.round((sxp-L)/((W-L-R)/(data.length-1)));
          idx=NB.clamp(idx,0,data.length-1);
          api.state.extra.hover=idx;
          api.redraw();
          if(tip){
            const x=L+idx*(W-L-R)/(data.length-1);
            const y=T+(1-data[idx]/maxV)*(HGT-T-B);
            tip.style.left=(x/W*100)+'%';
            tip.style.top=(y/HGT*100)+'%';
            tip.innerHTML='<span style="color:rgba(130,160,150,.7);margin-right:5px">'+months[idx]+'</span><b>'+data[idx]+' t/ha</b>';
            tip.style.opacity='1';
          }
        });
        cv.addEventListener('pointerleave',()=>{
          api.state.extra.hover=-1;api.redraw();
          if(tip)tip.style.opacity='0';
        });
      }
    });
  })();

  /* ════════ impact classification — sqrt-scaled horizontal bars ════════ */
  NB.charts.register('#impactChart',200,(ctx,W,H,p,ex)=>{
    const data=[
      {label:'Litter',        count:2466, clr:'#d06050'},
      {label:'Machine Track', count:816,  clr:'#e8a84a'},
      {label:'Built Structure',count:24,  clr:'#4a7fd0'},
      {label:'Fence',         count:4,    clr:'#8fa88a'},
      {label:'Wheels',        count:1,    clr:'#9b8fe8'},
      {label:'Gate',          count:1,    clr:'#3ce8a6'},
    ];
    const maxSqrt=Math.sqrt(data[0].count);
    const rowH=22,gap=9;
    const totalH=data.length*(rowH+gap)-gap;
    const startY=(H-totalH)/2;
    const labelW=118,valW=52,barAreaW=W-labelW-valW-8;

    data.forEach((d,i)=>{
      const y=startY+i*(rowH+gap);
      const isHov=ex.hover===i;
      const entryP=NB.ease.outCubic(NB.clamp((p-.08*i)/.72,0,1));
      const barFrac=(Math.sqrt(d.count)/maxSqrt)*entryP;
      const bw=Math.max(barFrac*barAreaW,entryP>0?3:0);

      /* track */
      rr(ctx,labelW,y+(rowH-8)/2,barAreaW,8,4);
      ctx.fillStyle=isHov?'rgba(255,255,255,.14)':'rgba(255,255,255,.07)';
      ctx.fill();

      /* fill */
      if(bw>0){
        rr(ctx,labelW,y+(rowH-8)/2,bw,8,4);
        ctx.globalAlpha=isHov?1:.8;
        ctx.fillStyle=d.clr;
        ctx.fill();
        ctx.globalAlpha=1;
      }

      /* label */
      ctx.textAlign='right';
      ctx.font=(isHov?'600 ':'')+'11.5px "Inter Tight",sans-serif';
      ctx.fillStyle=isHov?'rgba(235,248,242,.95)':'rgba(180,210,200,.72)';
      ctx.fillText(d.label,labelW-10,y+rowH/2+4);

      /* count (count-up) */
      const shown=Math.round(d.count*entryP);
      ctx.textAlign='left';
      ctx.font='10.5px "JetBrains Mono",monospace';
      ctx.fillStyle=isHov?d.clr:'rgba(180,210,200,.55)';
      ctx.fillText(shown.toLocaleString(),labelW+bw+8,y+rowH/2+4);
    });

    /* hover dot on right edge of fill */
    if(ex.hover>=0&&ex.hover<data.length){
      const d=data[ex.hover],i=ex.hover;
      const y=startY+i*(rowH+gap);
      const bw=Math.max((Math.sqrt(d.count)/maxSqrt)*barAreaW,3);
      ctx.beginPath();ctx.arc(labelW+bw,y+rowH/2,5,0,Math.PI*2);
      ctx.fillStyle=d.clr;ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1.5;ctx.stroke();
    }
  },{dur:1400,done(api){
    /* hover interaction */
    const cv=api.canvas;
    const data=[
      {label:'Litter',count:2466,clr:'#d06050'},
      {label:'Machine Track',count:816,clr:'#e8a84a'},
      {label:'Built Structure',count:24,clr:'#4a7fd0'},
      {label:'Fence',count:4,clr:'#8fa88a'},
      {label:'Wheels',count:1,clr:'#9b8fe8'},
      {label:'Gate',count:1,clr:'#3ce8a6'},
    ];
    const rowH=22,gap=9,totalH=data.length*(rowH+gap)-gap;
    const getRow=y=>{
      const W=api.width();
      const startY=(200-totalH)/2;
      const i=Math.floor((y-startY)/(rowH+gap));
      return(i>=0&&i<data.length&&y>=startY+i*(rowH+gap)&&y<startY+i*(rowH+gap)+rowH)?i:-1;
    };
    cv.addEventListener('mousemove',e=>{
      const r=cv.getBoundingClientRect();
      const scaleY=200/r.height;
      api.state.extra.hover=getRow((e.clientY-r.top)*scaleY);
      api.redraw();
    });
    cv.addEventListener('mouseleave',()=>{api.state.extra.hover=-1;api.redraw();});
  }});

})();