(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const pointer=matchMedia('(hover: hover) and (pointer: fine)');
  const media=document.querySelector('.hero-media>.media');
  const caption=document.querySelector('.media-caption');
  [media,caption].filter(Boolean).forEach(el=>{
    let frame=0;
    const reset=()=>{cancelAnimationFrame(frame);el.classList.remove('hero-hover');['--hero-rx','--hero-ry','--light-x','--light-y'].forEach(p=>el.style.removeProperty(p));};
    el.addEventListener('pointermove',e=>{
      if(reduced.matches||!pointer.matches||e.pointerType==='touch')return;
      cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
        const box=el.getBoundingClientRect();
        const x=Math.max(0,Math.min(1,(e.clientX-box.left)/box.width));
        const y=Math.max(0,Math.min(1,(e.clientY-box.top)/box.height));
        el.style.setProperty('--hero-rx',`${(0.5-y)*8}deg`);
        el.style.setProperty('--hero-ry',`${(x-0.5)*10}deg`);
        el.style.setProperty('--light-x',`${x*100}%`);
        el.style.setProperty('--light-y',`${y*100}%`);
        el.classList.add('hero-hover');
      });
    });
    el.addEventListener('pointerleave',reset);pointer.addEventListener('change',reset);reduced.addEventListener('change',reset);
  });
  // Proximity response keeps decorative layers from intercepting links or scrolling.
  const bubbles=[...document.querySelectorAll('.vfx-orbs span,.section-vfx span,.water-layer span')];
  let frame=0;
  const clear=()=>{cancelAnimationFrame(frame);bubbles.forEach(b=>b.classList.remove('bubble-near'));};
  document.addEventListener('pointermove',e=>{
    if(reduced.matches||!pointer.matches||e.pointerType==='touch')return;
    cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
      bubbles.forEach(b=>{
        const r=b.getBoundingClientRect();
        const visible=r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;
        const near=visible&&Math.hypot(e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2)<Math.max(65,r.width*.7);
        b.classList.toggle('bubble-near',near);
      });
    });
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',clear);
  window.addEventListener('scroll',clear,{passive:true});
  reduced.addEventListener('change',clear);pointer.addEventListener('change',clear);
})();
