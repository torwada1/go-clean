(() => {
  'use strict';
  const config = window.GO_CLEAN_CONFIG || {};
  const notice = document.getElementById('notice');
  let timer;
  const notify = message => {
    notice.textContent = message;
    notice.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(() => { notice.hidden = true; }, 5500);
  };
  const safeUrl = value => {
    if (!value) return '';
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
  };
  const phone = String(config.whatsappNumber || '');
  const whatsapp = message => /^\d{7,15}$/.test(phone) ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : '';
  document.querySelectorAll('[data-link]').forEach(link => {
    const type = link.dataset.link;
    const message = (config.bookingMessage || 'أهلًا، حابب أحجز غسلة.') + (link.dataset.package ? ` الباقة: ${link.dataset.package}` : '');
    const urls = { book: safeUrl(config.bookingUrl) || whatsapp(message), whatsapp: whatsapp(message), instagram: safeUrl(config.instagramUrl), facebook: safeUrl(config.facebookUrl), tiktok: safeUrl(config.tiktokUrl), linktree: safeUrl(config.linktreeUrl) };
    if (type === 'facebook' && !urls[type]) { link.hidden = true; return; }
    if (urls[type]) { link.href = urls[type]; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    else {
      link.setAttribute('aria-label', `${link.textContent.trim()} — الرابط غير مضاف بعد`);
      link.addEventListener('click', event => { event.preventDefault(); notify(document.documentElement.lang === 'en' ? 'This contact link is not available yet.' : 'وسيلة التواصل دي لسه مش مضافة. بيانات الحجز هتتوفر قريبًا.'); });
    }
  });
  document.querySelectorAll('[data-text]').forEach(node => { if (config[node.dataset.text]) node.textContent = config[node.dataset.text]; });
  document.querySelectorAll('[data-price]').forEach(node => { const value = config.prices?.[node.dataset.price]; if (value) { node.replaceChildren(document.createTextNode(`${value} `)); const currency = document.createElement('small'); currency.textContent = 'ج.م'; node.append(currency); } });
  const alts = { logo: 'شعار Go Clean Co.', hero: 'عناية بالسيارة من Go Clean Co.', exteriorBefore: 'السيارة من الخارج قبل التنظيف', exteriorAfter: 'السيارة من الخارج بعد التنظيف', interiorBefore: 'صالون السيارة قبل التنظيف', interiorAfter: 'صالون السيارة بعد التنظيف' };
  document.querySelectorAll('[data-image]').forEach(node => {
    const key = node.dataset.image;
    const source = config.images?.[key];
    if (!source) return;
    const img = new Image(); img.alt = alts[key]; img.decoding = 'async';
    if (key !== 'hero' && key !== 'logo') img.loading = 'lazy';
    img.onload = () => { node.replaceChildren(img); node.classList.remove('placeholder'); if (key.endsWith('Before') || key.endsWith('After')) { const badge = document.createElement('b'); badge.textContent = key.endsWith('Before') ? 'BEFORE' : 'AFTER'; node.append(badge); } };
    img.onerror = () => { node.title = 'تعذر تحميل الصورة؛ راجع مسارها في config.js'; };
    img.src = source;
  });
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('navigation');
  function closeMenu() { toggle.setAttribute('aria-expanded', 'false'); navigation.classList.remove('open'); }
  toggle.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); navigation.classList.toggle('open', open); });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
  document.getElementById('year').textContent = new Date().getFullYear();
})();



