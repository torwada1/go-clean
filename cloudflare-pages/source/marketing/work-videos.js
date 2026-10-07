const workVideos = [[1, "inside", "تنظيف أرضية المقصورة", "Cabin floor care"], [2, "inside", "مسح الطابلوه والكونسول", "Dashboard and console wipe"], [3, "outside", "رش الزجاج والواجهة", "Windshield and exterior spray"], [4, "before", "حالة المقصورة قبل التنظيف", "Cabin before cleaning"], [5, "result", "تفاصيل المقصورة بعد التنظيف", "Finished cabin details"], [6, "outside", "تنظيف الجنوط بالفرشاة", "Brushing the wheels"], [7, "outside", "العناية بتفاصيل الجنط", "Wheel detail work"], [8, "before", "المقاعد الخلفية قبل التنظيف", "Rear seats before cleaning"], [9, "inside", "تنظيف المقاعد والزوايا الداخلية", "Seats and interior corners"], [10, "before", "الأرضية الأمامية قبل التنظيف", "Front footwell before cleaning"], [11, "result", "جولة في المقاعد الخلفية", "Rear cabin walkthrough"], [12, "result", "جولة في المقصورة الأمامية", "Front cabin walkthrough"], [13, "before", "أرضية المقصورة قبل التنظيف", "Cabin floor before cleaning"], [14, "result", "المقاعد والأرضية بعد التنظيف", "Seats and floor after cleaning"], [15, "inside", "تنظيف تحت المقاعد", "Cleaning under the seats"], [16, "result", "تفاصيل المقصورة من الداخل", "Interior details"], [17, "result", "جولة حول العربية ومن الداخل", "Exterior and cabin walkthrough"]];
(()=>{
 const host=document.querySelector('#work-videos');if(!host)return;
 const groups=[['all','كل الفيديوهات','All videos'],['before','قبل التنظيف','Before cleaning'],['inside','تنظيف داخلي','Interior care'],['outside','غسيل خارجي وجنوط','Exterior and wheels'],['result','جولات ونتائج','Walkthroughs and results']];
 let selected='all',lastFocus;
 const dialog=document.querySelector('.work-dialog');
 const en=()=>document.documentElement.lang==='en';
 function close(){const v=dialog.querySelector('video');v.pause();v.removeAttribute('src');v.load();dialog.close();lastFocus?.focus();}
 dialog.querySelector('button').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close()});dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
 function render(){
 host.querySelector('.work-title').textContent=en()?'Real work. Every detail.':'شغل حقيقي، في كل تفصيلة.';
 host.querySelector('.work-intro').textContent=en()?'Explore care in action and cabin walkthroughs. These clips feature different cars; they are not paired comparisons.':'شوف مراحل العناية ولقطات من عربيات اشتغلنا عليها. الفيديوهات لعربيات مختلفة، وكل لقطة مستقلة عن التانية.';
 const filters=host.querySelector('.work-filters');filters.replaceChildren();
 groups.forEach(([key,ar,english])=>{const b=document.createElement('button');b.type='button';b.textContent=en()?english:ar;b.setAttribute('aria-pressed',key===selected);b.onclick=()=>{selected=key;render();filters.querySelector(`[data-key="${key}"]`).focus()};b.dataset.key=key;filters.append(b)});
 const list=host.querySelector('.work-list');list.replaceChildren();
 workVideos.filter(x=>selected==='all'||x[1]===selected).forEach(([id,group,ar,english])=>{
 const b=document.createElement('button');b.type='button';b.className='work-card';const title=en()?english:ar;
 const img=document.createElement('img');img.src=`assets/work/${id}.webp`;img.alt='';img.loading='lazy';img.width=230;img.height=320;
 const play=document.createElement('span');play.className='work-play';play.textContent='▶';play.setAttribute('aria-hidden','true');
 const label=document.createElement('strong');label.textContent=title;b.setAttribute('aria-label',(en()?'Play: ':'تشغيل: ')+title);b.append(img,play,label);
 b.onclick=()=>{lastFocus=b;const v=dialog.querySelector('video');v.src=`assets/work/${id}.mp4`;v.poster=img.src;dialog.querySelector('p').textContent=title;dialog.querySelector('button').setAttribute('aria-label',en()?'Close':'إغلاق');dialog.showModal();v.play().catch(()=>{})};list.append(b);
 });
 host.querySelector('.work-hint').textContent=en()?'Swipe to explore · Tap a video to watch':'اسحب لمشاهدة باقي الفيديوهات · اضغط على الفيديو لتشغيله';
 }
 new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});render();
})();
