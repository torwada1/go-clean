(() => {
 const host='https://go-clean-bookings.mohamedood48.chatgpt.site';
 const section=document.querySelector('#reviews');if(!section)return;
 const list=section.querySelector('.customer-reviews-grid'),state=section.querySelector('.reviews-state');
 fetch(host+'/api/reviews',{credentials:'omit'}).then(async r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{
  state.textContent=data.reviews.length?'':'جرّبت خدمتنا؟ شاركنا رأيك، تجربتك تفرق معانا.';
  data.reviews.slice(0,3).forEach(review=>{
   const card=document.createElement('article'),name=document.createElement('h3'),stars=document.createElement('p'),comment=document.createElement('p');
   name.textContent=review.name;stars.textContent='★'.repeat(review.rating)+'☆'.repeat(5-review.rating);stars.className='customer-stars';stars.setAttribute('aria-label',review.rating+' من ٥ نجوم');
   comment.textContent=review.comment;comment.className='customer-review-comment';
   card.append(stars,name,comment);list.append(card);
  });
 }).catch(()=>{state.textContent='شوف آراء العملاء أو اكتب تقييمك من صفحة التقييمات.';});
})();

