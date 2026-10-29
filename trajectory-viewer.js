/* Recorded peg-center trajectories in hole-frame millimetres.
 * Orthographic projection with equal spatial scale; no inferred/interpolated data.
 */
(() => {
  'use strict';
  const data = window.CW_PEG_TRAJECTORIES;
  const wrapper = document.querySelector('[data-trajectory-viewer]');
  const canvas = wrapper?.querySelector('[data-trajectory-canvas]');
  if (!canvas || !data?.series?.length) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const series = data.series.filter(s => Array.isArray(s.center) && s.center.length &&
    s.center.every(p => p.length === 3 && p.every(Number.isFinite)));
  if (!series.length) return;
  const enabled = new Set(series.map(s => s.id));
  const status = wrapper.querySelector('[data-trajectory-status]');
  const statusDefault = 'Drag to rotate · Focus and scroll to zoom · Point to a trajectory sample for values.';
  const points = series.flatMap(s => s.center);
  const minima = [0,1,2].map(k => Math.min(...points.map(p => p[k])));
  const maxima = [0,1,2].map(k => Math.max(...points.map(p => p[k])));
  // A minimal padded box encloses the recorded centers. This is not the hole wall.
  const ranges = minima.map((v,k) => Math.max(maxima[k]-v,1));
  const low = minima.map((v,k) => Math.floor((v-ranges[k]*.1)/2)*2);
  const high = maxima.map((v,k) => Math.ceil((v+ranges[k]*.1)/2)*2);
  const midpoint = low.map((v,k) => (v+high[k])/2);
  const corners=[];
  for (let x=0;x<2;x++) for(let y=0;y<2;y++) for(let z=0;z<2;z++)
    corners.push([x?high[0]:low[0],y?high[1]:low[1],z?high[2]:low[2]]);
  let yaw=-.65,pitch=.4,zoom=1,width=0,height=0,pixelRatio=1,frame=0,hover=null,drag=null;
  let projections=[];
  canvas.tabIndex=0;
  canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label','Interactive 3D peg-center trajectories in hole-frame X, Y, Z millimetres. Drag to rotate. Arrow keys rotate, plus and minus zoom, Home resets. Coordinates use equal spatial scale.');
  canvas.style.touchAction='none';
  function say(text=statusDefault){if(status)status.textContent=text;}
  function rotate(point){
    const x=point[0]-midpoint[0],y=point[1]-midpoint[1],z=point[2]-midpoint[2];
    const horizontal=Math.cos(yaw)*x-Math.sin(yaw)*y;
    const forward=Math.sin(yaw)*x+Math.cos(yaw)*y;
    return [horizontal,Math.sin(pitch)*forward-Math.cos(pitch)*z,Math.cos(pitch)*forward+Math.sin(pitch)*z];
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(draw);}
  function draw(){
    frame=0;
    const bounds=canvas.getBoundingClientRect();
    if(bounds.width<10 || bounds.height<10)return;
    width=bounds.width;height=bounds.height;pixelRatio=Math.min(window.devicePixelRatio||1,2);
    const w=Math.round(width*pixelRatio),h=Math.round(height*pixelRatio);
    if(canvas.width!==w || canvas.height!==h){canvas.width=w;canvas.height=h;}
    ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);ctx.clearRect(0,0,width,height);
    ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);
    const box=corners.map(rotate);
    const xs=box.map(p=>p[0]),ys=box.map(p=>p[1]);
    const spanX=Math.max(...xs)-Math.min(...xs),spanY=Math.max(...ys)-Math.min(...ys);
    const showXYInset=width>=700 && pitch<1.45;
    const mainWidth=showXYInset?width*.49:width;
    const scale=Math.min((mainWidth-112)/Math.max(spanX,1),(height-116)/Math.max(spanY,1))*zoom;
    const originX=mainWidth/2,originY=height/2+4;
    const project=p=>{const r=rotate(p);return [originX+r[0]*scale,originY+r[1]*scale,r[2]];};
    function line(a,b,color,lineWidth=1,dash=[]){const p=project(a),q=project(b);ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.setLineDash(dash);ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();ctx.setLineDash([]);}
    function label(text,p,dx=0,dy=0,align='center',color='#4b5157'){
      const q=project(p);ctx.font='14px Georgia, "Times New Roman", serif';ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(text,q[0]+dx,q[1]+dy);
    }
    // Faint bounding box and XY grid; no artificial surface or target trajectory.
    for(let i=0;i<corners.length;i++)for(let j=i+1;j<corners.length;j++)
      if(corners[i].filter((v,k)=>v!==corners[j][k]).length===1)line(corners[i],corners[j],'#e1e5e9',.85);
    for(let i=1;i<4;i++){
      const x=low[0]+i*(high[0]-low[0])/4,y=low[1]+i*(high[1]-low[1])/4;
      line([x,low[1],low[2]],[x,high[1],low[2]],'#edf0f3',.7);
      line([low[0],y,low[2]],[high[0],y,low[2]],'#edf0f3',.7);
    }
    const base=[...low];
    const xEnd=[high[0],low[1],low[2]],yEnd=[low[0],high[1],low[2]],zEnd=[low[0],low[1],high[2]];
    line(base,xEnd,'#7c8289',1.2);line(base,yEnd,'#7c8289',1.2);line(base,zEnd,'#7c8289',1.2);
    label('X [mm]',xEnd,20,13,'left');label('Y [mm]',yEnd,-10,23,'right');
    if(pitch<1.45)label('Z [mm]',zEnd,-14,-16,'right');
    for(let i=0;i<3;i++){
      const fraction=i/2;
      const x=low[0]+fraction*(high[0]-low[0]),y=low[1]+fraction*(high[1]-low[1]),z=low[2]+fraction*(high[2]-low[2]);
      if(pitch>1.45 || i===2)label(x.toFixed(0),[x,low[1],low[2]],0,16);
      if((pitch>1.45 && i) || i===2)label(y.toFixed(0),[low[0],y,low[2]],-12,5,'right');
      if(pitch<1.45)label(z.toFixed(0),[low[0],low[1],z],-14,-3,'right');
    }
    projections=[];
    const segments=[];
    series.filter(s=>enabled.has(s.id)).forEach(s=>{
      const projected=s.center.map(project);
      projected.forEach((p,index)=>projections.push({p,index,series:s}));
      for(let i=1;i<projected.length;i++)segments.push({a:projected[i-1],b:projected[i],color:s.color,depth:(projected[i-1][2]+projected[i][2])/2});
    });
    segments.sort((a,b)=>a.depth-b.depth);
    ctx.lineWidth=2.1;ctx.lineJoin='round';ctx.lineCap='round';
    segments.forEach(s=>{ctx.beginPath();ctx.strokeStyle=s.color;ctx.moveTo(s.a[0],s.a[1]);ctx.lineTo(s.b[0],s.b[1]);ctx.stroke();});
    series.filter(s=>enabled.has(s.id)).forEach(s=>{
      const a=project(s.center[0]),b=project(s.center[s.center.length-1]);
      ctx.strokeStyle=s.color;ctx.fillStyle='#fff';ctx.lineWidth=2.3;
      ctx.beginPath();ctx.arc(a[0],a[1],5,0,Math.PI*2);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(b[0]-5,b[1]-5);ctx.lineTo(b[0]+5,b[1]+5);ctx.moveTo(b[0]-5,b[1]+5);ctx.lineTo(b[0]+5,b[1]-5);ctx.stroke();
    });
    if(hover && enabled.has(hover.series.id)){
      const p=project(hover.series.center[hover.index]);ctx.beginPath();ctx.arc(p[0],p[1],6,0,Math.PI*2);ctx.fillStyle=hover.series.color;ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='#fff';ctx.stroke();
    }
    if(showXYInset){
      // A second equal-scale XY projection makes lateral motion visible without
      // stretching the actual XYZ trajectory or combining center and tip data.
      const left=width*.52+32,right=width-36;
      const size=Math.min(right-left,height-134);
      const originLeft=(left+right-size)/2,originTop=(height-size)/2+1;
      const extent=Math.max(high[0]-low[0],high[1]-low[1]);
      const x0=midpoint[0]-extent/2,y0=midpoint[1]-extent/2;
      const px=p=>[originLeft+(p[0]-x0)/extent*size,originTop+size-(p[1]-y0)/extent*size];
      ctx.font='16px Georgia, "Times New Roman", serif';ctx.fillStyle='#4b5157';ctx.textAlign='center';ctx.textBaseline='bottom';
      ctx.fillText('XY projection [mm]',originLeft+size/2,originTop-24);
      ctx.lineWidth=.8;ctx.strokeStyle='#edf0f3';ctx.font='12px Georgia, "Times New Roman", serif';
      for(let i=0;i<=4;i++){
        const x=originLeft+i*size/4,y=originTop+i*size/4;
        ctx.beginPath();ctx.moveTo(x,originTop);ctx.lineTo(x,originTop+size);ctx.moveTo(originLeft,y);ctx.lineTo(originLeft+size,y);ctx.stroke();
        ctx.fillStyle='#646b74';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText((x0+i*extent/4).toFixed(1),x,originTop+size+9);
        ctx.textAlign='right';ctx.textBaseline='middle';ctx.fillText((y0+extent-i*extent/4).toFixed(1),originLeft-9,y);
      }
      ctx.strokeStyle='#7c8289';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(originLeft,originTop);ctx.lineTo(originLeft,originTop+size);ctx.lineTo(originLeft+size,originTop+size);ctx.stroke();
      ctx.font='14px Georgia, "Times New Roman", serif';ctx.fillStyle='#4b5157';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText('X [mm]',originLeft+size/2,originTop+size+30);
      ctx.save();ctx.translate(originLeft-42,originTop+size/2);ctx.rotate(-Math.PI/2);ctx.textBaseline='bottom';ctx.fillText('Y [mm]',0,0);ctx.restore();
      series.filter(s=>enabled.has(s.id)).forEach(s=>{
        const projected=s.center.map(px);ctx.strokeStyle=s.color;ctx.lineWidth=2.1;ctx.beginPath();
        projected.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();
        const a=projected[0],b=projected[projected.length-1];ctx.fillStyle='#fff';ctx.lineWidth=2.3;ctx.beginPath();ctx.arc(a[0],a[1],5,0,Math.PI*2);ctx.fill();ctx.stroke();
        ctx.beginPath();ctx.moveTo(b[0]-5,b[1]-5);ctx.lineTo(b[0]+5,b[1]+5);ctx.moveTo(b[0]-5,b[1]+5);ctx.lineTo(b[0]+5,b[1]-5);ctx.stroke();
      });
    }
    ctx.font='14px Georgia, "Times New Roman", serif';ctx.fillStyle='#646b74';ctx.textAlign='left';ctx.textBaseline='top';
    ctx.fillText('Hole-frame coordinates · equal spatial scale',16,14);
    ctx.textBaseline='bottom';ctx.fillText('○ Start    × End',16,height-12);
    ctx.textAlign='right';ctx.fillText(`${zoom.toFixed(1)}×`,width-16,height-12);
  }
  function clearPreset(){wrapper.querySelectorAll('[data-trajectory-view]').forEach(b=>b.setAttribute('aria-pressed','false'));}
  function preset(view){
    if(view==='top'){yaw=0;pitch=Math.PI/2;}
    else if(view==='front'){yaw=0;pitch=0;}
    else{yaw=-.65;pitch=.4;}
    zoom=1;hover=null;say();
    wrapper.querySelectorAll('[data-trajectory-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.trajectoryView===view)));
    schedule();
  }
  function zoomBy(factor){zoom=Math.max(.5,Math.min(5,zoom*factor));schedule();}
  wrapper.querySelectorAll('[data-trajectory-view]').forEach(b=>b.addEventListener('click',()=>preset(b.dataset.trajectoryView)));
  wrapper.querySelectorAll('[data-trajectory-reset]').forEach(b=>b.addEventListener('click',()=>preset('orbit')));
  wrapper.querySelectorAll('[data-trajectory-zoom]').forEach(b=>b.addEventListener('click',()=>zoomBy(b.dataset.trajectoryZoom==='in'?1.2:1/1.2)));
  wrapper.querySelectorAll('[data-trajectory-method]').forEach(b=>{
    const id=b.dataset.trajectoryMethod;
    b.setAttribute('aria-pressed',String(enabled.has(id)));
    b.addEventListener('click',()=>{enabled.has(id)?enabled.delete(id):enabled.add(id);b.setAttribute('aria-pressed',String(enabled.has(id)));hover=null;say();schedule();});
  });
  canvas.addEventListener('pointerdown',event=>{if(event.button!==0)return;canvas.focus({preventScroll:true});drag={id:event.pointerId,x:event.clientX,y:event.clientY};canvas.setPointerCapture(event.pointerId);canvas.style.cursor='grabbing';hover=null;});
  canvas.addEventListener('pointermove',event=>{
    if(drag && event.pointerId===drag.id){
      yaw+=(event.clientX-drag.x)*.008;pitch=Math.max(-1.4,Math.min(1.55,pitch+(event.clientY-drag.y)*.008));
      drag.x=event.clientX;drag.y=event.clientY;clearPreset();schedule();return;
    }
    const rect=canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;
    let nearest=null,distance=14*14;
    projections.forEach(s=>{const d=(s.p[0]-x)**2+(s.p[1]-y)**2;if(d<distance){distance=d;nearest=s;}});
    hover=nearest;
    if(nearest){const s=nearest.series,i=nearest.index,c=s.center[i];say(`${s.label} · ${Number(s.time[i]).toFixed(2)} s · Center (${c.map(v=>v.toFixed(2)).join(', ')}) mm · Tip depth ${Number(s.depth[i]).toFixed(2)} mm`);}
    else say();
    schedule();
  });
  function endDrag(event){if(drag?.id===event.pointerId){drag=null;canvas.style.cursor='grab';}}
  canvas.addEventListener('pointerup',endDrag);canvas.addEventListener('pointercancel',endDrag);canvas.addEventListener('lostpointercapture',endDrag);
  canvas.addEventListener('pointerleave',()=>{if(!drag){hover=null;say();schedule();}});
  canvas.addEventListener('wheel',event=>{if(document.activeElement!==canvas)return;event.preventDefault();zoomBy(Math.exp(-event.deltaY*.0015));},{passive:false});
  canvas.addEventListener('keydown',event=>{
    let handled=true;
    if(event.key==='ArrowLeft'){yaw-=.12;clearPreset();}
    else if(event.key==='ArrowRight'){yaw+=.12;clearPreset();}
    else if(event.key==='ArrowUp'){pitch=Math.min(1.55,pitch+.12);clearPreset();}
    else if(event.key==='ArrowDown'){pitch=Math.max(-1.4,pitch-.12);clearPreset();}
    else if(event.key==='+' || event.key==='=')zoomBy(1.2);
    else if(event.key==='-' || event.key==='_')zoomBy(1/1.2);
    else if(event.key==='Home')preset('orbit');
    else handled=false;
    if(handled){event.preventDefault();schedule();}
  });
  canvas.style.cursor='grab';
  new ResizeObserver(schedule).observe(canvas);
  document.addEventListener('simulation-tab-change',schedule);
  preset('orbit');
})();
