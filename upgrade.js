
(() => {
'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const entries=window.GO_CLEAN_GALLERY||[];
const stage=document.querySelector('.orbit-stage'),ring=document.querySelector('.orbit-ring'),dots=document.querySelector('.orbit-dots'),dialog=document.querySelector('.gallery-dialog');
const en=()=>document.documentElement.lang==='en';
let pos=0,target=0,hover=false,focused=false,drag=null,suppress=false,visible=false,last=0,frame=0,active=-1;
const cards=entries.map((item,i)=>{
 const card=document.createElement('button');card.className='orbit-card';card.type='button';card.dataset.tag=item.tag;
 if(item.type==='image'){const img=new Image();img.src=item.src;img.alt='';img.loading='lazy';img.decoding='async';img.draggable=false;card.append(img);}
 else{const cover=document.createElement('span');cover.className='video-cover';cover.innerHTML='<span class="play" aria-hidden="true">▶</span><small>GO CLEAN / IN ACTION</small>';if(item.poster){const img=new Image();img.src=item.poster;img.alt='';img.loading='lazy';img.draggable=false;cover.prepend(img);}card.append(cover);}
 const tag=document.createElement('span');tag.className='gallery-tag';tag.textContent=item.tag;
 const title=document.createElement('span');title.className='orbit-title';card.append(tag,title);ring.append(card);
 card.addEventListener('click',()=>{if(suppress)return;open(i,card);});
 const dot=document.createElement('button');dot.type='button';dot.addEventListener('click',()=>{target=pos+(((i-pos)%entries.length+entries.length*1.5)%entries.length-entries.length/2);wake();});dots.append(dot);
 return card;
});
function labels(){
 cards.forEach((card,i)=>{const label=en()?entries[i].en:entries[i].ar;card.querySelector('.orbit-title').textContent=label;card.setAttribute('aria-label',label);dots.children[i].setAttribute('aria-label',label);});
 if(dialog.open)document.querySelector('.dialog-caption').textContent=en()?entries[Number(dialog.dataset.index)].en:entries[Number(dialog.dataset.index)].ar;
}
function paint(){
 const n=entries.length;
 const center=((Math.round(pos)%n)+n)%n;
 cards.forEach((card,i)=>{
  const distance=((i-pos+n*100+n/2)%n)-n/2;const edge=Math.max(0,Math.min(1,(3.5-Math.abs(distance))/.65));card.style.visibility=edge===0?'hidden':'visible';card.style.pointerEvents=edge<.2?'none':'auto';const a=distance*2*Math.PI/8,c=Math.cos(a),s=Math.sin(a),radius=Math.min(stage.clientWidth*.35,370);
  card.style.transform='translate3d('+s*radius+'px,'+(1-c)*15+'px,'+(c-1)*110+'px) rotateY('+(-s*23)+'deg) scale('+(0.7+0.3*(c+1)/2)+')';
  card.style.opacity=String((.22+.78*(c+1)/2)*edge);card.style.zIndex=String(Math.round((c+1)*100));card.tabIndex=i===center?0:-1;
 });
 if(center!==active){active=center;[...dots.children].forEach((d,i)=>d.setAttribute('aria-current',String(i===active)));document.querySelector('.orbit-counter').textContent=String(active+1).padStart(2,'0')+' / '+String(n).padStart(2,'0');}
}
function tick(now){
 frame=0;const dt=Math.min(now-last||16,40);last=now;
 if(!hover&&!focused&&!drag&&!dialog.open&&!reduce.matches){target+=dt*.000035;}
 pos+= (target-pos)*(reduce.matches?1:1-Math.exp(-dt/105));paint();
 if(visible&&!document.hidden&&(!reduce.matches||Math.abs(target-pos)>.001))frame=requestAnimationFrame(tick);
}
function wake(){if(!frame&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}}
new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'}).observe(stage);
stage.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){hover=true;target=pos;}});
stage.addEventListener('pointerleave',()=>{hover=false;wake();});
document.querySelector('.gallery-shell').addEventListener('focusin',()=>{focused=true;target=pos;});
document.querySelector('.gallery-shell').addEventListener('focusout',e=>{if(!e.currentTarget.contains(e.relatedTarget)){focused=false;wake();}});
stage.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY,start:pos,id:e.pointerId,moved:false,velocity:0,lastX:e.clientX,lastTime:performance.now()};target=pos;suppress=false;});
stage.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>10){drag.moved=true;suppress=true;stage.setPointerCapture(e.pointerId);}if(drag.moved){const now=performance.now(),elapsed=Math.max(8,now-drag.lastTime);drag.velocity=.65*drag.velocity+.35*(e.clientX-drag.lastX)/elapsed;drag.lastX=e.clientX;drag.lastTime=now;target=drag.start-dx/160;wake();}});
function end(){if(!drag)return;const moved=drag.moved,velocity=performance.now()-drag.lastTime<100?drag.velocity:0;drag=null;if(moved){target=Math.round(target-(reduce.matches?0:Math.max(-1.2,Math.min(1.2,velocity*.7))));setTimeout(()=>{suppress=false;},250);}wake();}
stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
stage.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){e.preventDefault();target+=e.deltaX/200;wake();}},{passive:false});
stage.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();target=e.key==='Home'?0:e.key==='End'?entries.length-1:Math.round(target)+(e.key==='ArrowRight'?1:-1);pos=target;paint();cards[active].focus();}});
function open(i,trigger){
 const item=entries[i],host=document.querySelector('.dialog-media');host.replaceChildren();dialog.dataset.index=String(i);
 const media=document.createElement(item.type==='video'?'video':'img');media.src=item.src;
 if(item.type==='video'){media.controls=true;if(item.poster)media.poster=item.poster;media.playsInline=true;media.preload='metadata';}else media.alt=en()?item.en:item.ar;
 host.append(media);document.querySelector('.dialog-caption').textContent=en()?item.en:item.ar;
 dialog._trigger=trigger;dialog.showModal();document.body.style.overflow='hidden';
}
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{const video=dialog.querySelector('video');if(video){video.pause();video.removeAttribute('src');video.load();}document.querySelector('.dialog-media').replaceChildren();document.body.style.overflow='';dialog._trigger?.focus();wake();});
new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();});
reduce.addEventListener('change',()=>{target=Math.round(pos);wake();});window.addEventListener('resize',paint);
labels();paint();
// Draw the hose, its connected nozzle and moving water in one coordinate system.
const canvas=document.querySelector('.sprayer-canvas'),scene=canvas.parentElement,ctx=canvas.getContext('2d');
let heroVisible=true,heroFrame=0,time=0,prev=0,aim=0;
function resize(){const b=scene.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(b.width*d);canvas.height=Math.round(b.height*d);draw();}
function path(points){ctx.beginPath();ctx.moveTo(...points[0]);points.slice(1).forEach(p=>ctx.lineTo(...p));ctx.closePath();}
function draw(){
 ctx.setTransform(canvas.width/1000,0,0,canvas.height/562,0,0);ctx.clearRect(0,0,1000,562);
 const x=175+Math.sin(time*.55)*23,y=135+Math.sin(time*.8)*22,angle=.08+Math.sin(time*.65)*.14+aim*.18;
 const hx=x+Math.cos(angle)*(-37)-Math.sin(angle)*64,hy=y+Math.sin(angle)*(-37)+Math.cos(angle)*64;
 function hose(){ctx.beginPath();ctx.moveTo(143,429);ctx.bezierCurveTo(25,459,20,424,48,375);ctx.bezierCurveTo(110,330,165,435,80,450);ctx.bezierCurveTo(15,466,-8,385,30,340);ctx.bezierCurveTo(62+Math.sin(time)*8,290,95,235,hx,hy);}
 ctx.lineCap='round';for(const [color,width] of [['#020b12',15],['#2f5363',10],['#8db7c7',2]]){hose();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);
 const water=ctx.createLinearGradient(132,0,350,0);water.addColorStop(0,'#65d4ff99');water.addColorStop(.4,'#009fff55');water.addColorStop(1,'#21acff00');
 path([[132,-5],[380,-72],[390,74],[132,5]]);ctx.fillStyle=water;ctx.fill();
 if(!reduce.matches){for(let i=0;i<65;i++){const f=(time*.64+i*.618)%1,spread=Math.sin(i*37)*f*65;ctx.fillStyle='rgba(139,225,255,'+((1-f)*.7)+')';ctx.beginPath();ctx.ellipse(137+f*240,spread,1.8+f*2,.6+f,0,0,Math.PI*2);ctx.fill();}}
 const metal=ctx.createLinearGradient(0,-10,0,10);metal.addColorStop(0,'#f0fcff');metal.addColorStop(.4,'#9baeb6');metal.addColorStop(.6,'#344657');metal.addColorStop(1,'#cee3ef');
 ctx.fillStyle=metal;ctx.fillRect(12,-6,106,12);
 ctx.fillStyle='#058bd4';ctx.fillRect(116,-9,18,18);ctx.fillStyle='#93e5ff';ctx.fillRect(119,-7,3,14);
 const blue=ctx.createLinearGradient(-40,-20,25,60);blue.addColorStop(0,'#a3efff');blue.addColorStop(.35,'#087fcb');blue.addColorStop(1,'#052642');
 path([[-60,-20],[10,-20],[25,-10],[15,8],[-9,13],[-30,67],[-49,62],[-29,14],[-56,8]]);
 ctx.fillStyle=blue;ctx.strokeStyle='#69c6ec';ctx.lineWidth=2;ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(-7,13);ctx.bezierCurveTo(29,13,4,67,-25,64);ctx.strokeStyle='#87cbe3';ctx.lineWidth=4;ctx.stroke();
 ctx.beginPath();ctx.moveTo(-17,15);ctx.lineTo(-26,39);ctx.strokeStyle='#050f1b';ctx.lineWidth=6;ctx.stroke();
 ctx.fillStyle=metal;ctx.fillRect(-46,57,18,13);ctx.restore();
}
function animate(now){heroFrame=0;time+=Math.min(now-prev||16,40)/1000;prev=now;draw();if(heroVisible&&!document.hidden&&!reduce.matches)heroFrame=requestAnimationFrame(animate);}
function start(){if(!heroFrame&&heroVisible&&!document.hidden&&!reduce.matches){prev=performance.now();heroFrame=requestAnimationFrame(animate);}else draw();}
new ResizeObserver(resize).observe(scene);
new IntersectionObserver(es=>{heroVisible=es[0].isIntersecting;if(heroVisible)start();else{cancelAnimationFrame(heroFrame);heroFrame=0;}}).observe(scene);
scene.addEventListener('pointermove',e=>{const r=scene.getBoundingClientRect();aim=(e.clientY-r.top)/r.height-.5;});scene.addEventListener('pointerleave',()=>{aim=0;});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(heroFrame);heroFrame=0;}else start();});
reduce.addEventListener('change',()=>{cancelAnimationFrame(heroFrame);heroFrame=0;start();});resize();start();
})();



