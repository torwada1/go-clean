(() => {
'use strict';
const section=document.querySelector('#reviews');if(!section)return;
const list=section.querySelector('.customer-reviews-grid'),state=section.querySelector('.reviews-state');
const en=()=>document.documentElement.lang==='en';
fetch('https://go-clean-reservations.ballingerkyle56975.chatgpt.site/api/reviews',{credentials:'omit'}).then(async r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
 const rows=(data.reviews || []).map(r=>({...r,rating:r.rating ?? r.stars}));if(!rows.length){state.textContent=en()?'Tried our service? Share your feedback. Your experience matters to us.':'جرّبت خدمتنا؟ شاركنا رأيك، تجربتك تفرق معانا.';return;}
 state.textContent='';list.classList.add('review-orbit');list.setAttribute('role','region');list.setAttribute('aria-roledescription','carousel');
 const stage=document.createElement('div');stage.className='review-orbit-stage';const ring=document.createElement('div');ring.className='review-orbit-ring';stage.append(ring);list.append(stage);
 const controls=document.createElement('div');controls.className='review-orbit-controls';
 const hint=document.createElement('p'),counter=document.createElement('span'),dots=document.createElement('div');dots.className='review-orbit-dots';controls.append(hint,counter);list.append(controls,dots);
 let pos=0,target=0,active=-1,frame=0,last=0,visible=false,hover=false,focus=false,drag=null;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const cards=rows.map((r,i)=>{
  const card=document.createElement('article');card.className='review-orbit-card';card.dir='auto';
  const mark=document.createElement('span');mark.className='review-quote';mark.textContent='“';mark.setAttribute('aria-hidden','true');
  const stars=document.createElement('p');stars.className='customer-stars';stars.textContent='★'.repeat(r.rating)+'☆'.repeat(5-r.rating);
  const text=document.createElement('p');text.className='customer-review-comment';text.textContent=r.comment;
  const name=document.createElement('h3');name.textContent=r.name;
  card.append(mark,stars,text,name);ring.append(card);
  const dot=document.createElement('button');dot.type='button';dot.addEventListener('click',()=>go(i));dots.append(dot);
  card.addEventListener('click',()=>{if(!drag&&active!==i)go(i);});
  return card;
 });
 function paint(){
  const n=cards.length,center=((Math.round(pos)%n)+n)%n;
  cards.forEach((c,i)=>{
   const a=(i-pos)*2*Math.PI/n,depth=Math.cos(a),x=Math.sin(a)*Math.min(stage.clientWidth*.38,470);
   c.style.transform='translate3d('+x+'px,'+((1-depth)*22)+'px,'+((depth-1)*190)+'px) rotateY('+(-Math.sin(a)*28)+'deg) scale('+(0.78+0.22*(depth+1)/2)+')';
   c.style.zIndex=String(Math.round((depth+1)*100));c.style.opacity=String(.22+.78*(depth+1)/2);
   c.classList.toggle('is-active',i===center);c.tabIndex=i===center?0:-1;c.setAttribute('aria-hidden',String(i!==center));
  });
  if(center!==active){active=center;[...dots.children].forEach((d,i)=>d.setAttribute('aria-current',String(i===center)));counter.textContent=(center+1)+' / '+n;}
 }
 function go(i){const n=cards.length;target=pos+(((i-pos)%n+n*1.5)%n-n/2);if(reduced.matches)pos=target;paint();wake();}
 function tick(now){frame=0;const dt=Math.min(now-last||16,40);last=now;
  if(!hover&&!focus&&!drag&&!reduced.matches&&cards.length>1)target+=dt*.000018;
  pos+=(target-pos)*(reduced.matches?1:.12);paint();
  if(visible&&!document.hidden&&(!reduced.matches||Math.abs(target-pos)>.001))frame=requestAnimationFrame(tick);
 }
 function wake(){if(!frame&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}}
 stage.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'){hover=true;target=pos;}});
 stage.addEventListener('pointerleave',()=>{hover=false;wake();});
 list.addEventListener('focusin',()=>{focus=true;target=pos;});
 list.addEventListener('focusout',e=>{if(!list.contains(e.relatedTarget)){focus=false;wake();}});
 stage.addEventListener('pointerdown',e=>{if(e.button!==0||cards.length<2||e.target.closest('.customer-review-comment'))return;drag={x:e.clientX,y:e.clientY,start:pos,id:e.pointerId,moved:false};target=pos;});
 stage.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(!drag.moved&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>10){drag=null;return;}if(Math.abs(dx)>10){drag.moved=true;stage.setPointerCapture(e.pointerId);}if(drag.moved){pos=target=drag.start-dx/200;paint();}});
 function end(){if(!drag)return;const moved=drag.moved;drag=null;if(moved)target=Math.round(pos);wake();}
 stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);stage.addEventListener('lostpointercapture',end);
 list.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();target=e.key==='Home'?0:e.key==='End'?cards.length-1:Math.round(pos)+(e.key==='ArrowRight'?1:-1);pos=target;paint();cards[active].focus();});
 function labels(){list.setAttribute('aria-label',en()?'Customer reviews':'آراء العملاء');hint.textContent=cards.length>1?(en()?'Swipe the cards or choose a dot. Motion pauses while you read.':'اسحب الكروت أو اختار نقطة. الحركة بتقف وإنت بتقرأ.'):(en()?'A customer experience with Go Clean':'تجربة عميل مع Go Clean');cards.forEach((c,i)=>{dots.children[i].setAttribute('aria-label',(en()?'Review ':'تقييم ')+(i+1));c.querySelector('.customer-stars').setAttribute('aria-label',rows[i].rating+(en()?' out of 5 stars':' من ٥ نجوم'));});}
 if(cards.length===1){list.classList.add('single-review');dots.hidden=true;}
 new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)wake();else{cancelAnimationFrame(frame);frame=0;}}).observe(stage);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else wake();});
 reduced.addEventListener('change',()=>{target=Math.round(pos);wake();});
 new ResizeObserver(paint).observe(stage);new MutationObserver(labels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 labels();paint();
}).catch(()=>{state.textContent=en()?'Read customer feedback or write your own on our reviews page.':'شوف آراء العملاء أو اكتب تقييمك من صفحة التقييمات.';});
})();
