(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const layer = document.createElement('div');
  layer.className = 'water-layer'; layer.setAttribute('aria-hidden','true');
  [ [5,14,50,19], [88,20,72,24], [45,44,25,21], [12,74,36,26], [92,82,45,23], [70,62,22,18] ].forEach(([x,y,size,duration],i) => {
    const bubble=document.createElement('span');
    bubble.style.cssText=`--x:${x}%;--y:${y}%;--s:${size}px;--duration:${duration}s;--delay:-${i*3}s`;
    layer.append(bubble);
  });
  document.body.append(layer);
  function update() { root.classList.toggle('water-paused', reduced.matches); }
  reduced.addEventListener('change',update); update();
  document.addEventListener('visibilitychange',()=>root.classList.toggle('water-inactive',document.hidden));
  document.querySelectorAll('.real-gallery .media').forEach(frame=>{
    let raf=0;
    function reset(){cancelAnimationFrame(raf);frame.style.removeProperty('--photo-x');frame.style.removeProperty('--photo-y');frame.classList.remove('photo-active');}
    frame.addEventListener('pointermove',e=>{
      if(!fine.matches || reduced.matches || e.pointerType==='touch')return;
      cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{
        const r=frame.getBoundingClientRect();
        frame.style.setProperty('--photo-x',`${((e.clientX-r.left)/r.width-.5)*-8}px`);
        frame.style.setProperty('--photo-y',`${((e.clientY-r.top)/r.height-.5)*-8}px`);
        frame.classList.add('photo-active');
      });
    });
    frame.addEventListener('pointerleave',reset); reduced.addEventListener('change',reset); fine.addEventListener('change',reset);
  });
})();

