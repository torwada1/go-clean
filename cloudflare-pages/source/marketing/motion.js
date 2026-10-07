(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)');
  const hero = document.querySelector('.hero');
  const orbs = document.createElement('div');
  orbs.className = 'vfx-orbs'; orbs.setAttribute('aria-hidden', 'true');
  [[64,4,16],[26,45,12],[100,92,65],[35,52,83],[19,34,76],[52,80,7]].forEach(([size,left,top]) => {
    const orb = document.createElement('span');
    orb.style.cssText = `--size:${size}px;--left:${left}%;--top:${top}%`;
    orbs.append(orb);
  });
  hero.prepend(orbs);
  const cards = document.querySelectorAll('.services article, .package, .steps article, .reasons article, .gallery figure');
  cards.forEach(card => {
    card.classList.add('depth-card');
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0;
      card.style.removeProperty('--rx'); card.style.removeProperty('--ry'); card.style.removeProperty('--lift');
    };
    card.addEventListener('pointermove', event => {
      if (reduced.matches || !finePointer.matches || event.pointerType === 'touch') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const box = card.getBoundingClientRect();
        const x = Math.max(-.5,Math.min(.5,(event.clientX-box.left)/box.width-.5));
        const y = Math.max(-.5,Math.min(.5,(event.clientY-box.top)/box.height-.5));
        card.style.setProperty('--rx', `${-y*7}deg`);
        card.style.setProperty('--ry', `${x*7}deg`);
        card.style.setProperty('--lift', '-4px');
      });
    });
    card.addEventListener('pointerleave', reset);
    reduced.addEventListener('change', reset);
    finePointer.addEventListener('change', reset);
  });
  if (!('IntersectionObserver' in window)) return;
  const sections = document.querySelectorAll('main > section:not(.hero)');
  sections.forEach(section => {
    const accents = document.createElement('div');
    accents.className = 'section-vfx'; accents.setAttribute('aria-hidden', 'true');
    accents.append(document.createElement('span'), document.createElement('span'));
    section.append(accents);
    section.querySelectorAll('.services article, .package, .steps article, .reasons article, .gallery figure, .contact-details p, .socials a').forEach((item, index) => {
      item.classList.add('motion-item');
      item.style.setProperty('--item-delay', `${Math.min(index, 4) * 95}ms`);
    });
  });
  const accentsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!reduced.matches) entry.target.classList.add('vfx-arrived');
      accentsObserver.unobserve(entry.target);
    });
  }, {threshold:.12});
  sections.forEach(section => accentsObserver.observe(section));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('reveal-pending');
      if (!reduced.matches) entry.target.classList.add('reveal-in');
      observer.unobserve(entry.target);
    });
  }, {threshold:.05});
  sections.forEach(section => {
    // Keep visible and tall sections accessible; reveal only below the fold.
    if (!reduced.matches && section.getBoundingClientRect().top > innerHeight) {
      section.classList.add('reveal-pending'); observer.observe(section);
    }
    section.addEventListener('focusin', () => section.classList.remove('reveal-pending'));
    section.addEventListener('animationend', event => { if (event.target === section) section.classList.remove('reveal-in'); });
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) { observer.disconnect(); sections.forEach(section => section.classList.remove('reveal-pending','reveal-in')); }
  });
})();
