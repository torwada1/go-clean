# Go Clean — النسخة المعدلة

افتح index.html لمعاينة الموقع، أو ارفع محتويات ملف ZIP على Cloudflare Pages. يجب أن يكون index.html في جذر الملفات المرفوعة.

التعديلات: قسم «ليه تختار Go Clean؟» في البداية، شعار كبير مع رشاش وخرطوم متصل ومتحرك، جالري دائري للصور والفيديوهات، تحسين العرض على الموبايل والكروت والوضع الداكن، وروابط الحجز والفيسبوك.

أزرار الحجز تفتح نظام الحجوزات الحالي:
https://go-clean-bookings.mohamedood48.chatgpt.site/
الباقات الشهرية تفتح واتساب الشركة. هذه النسخة لا تغيّر نظام الحجز أو إعدادات تنبيهات البريد.

الجالري يحتوي على الوسائط الموجودة في الملف الأصلي: 5 صور و3 فيديوهات. الصور والفيديوهات الداخلية الأحدث لم تكن ضمن الملف المرسل.
لإضافة وسائط لاحقًا، ضعها في assets وأضف مدخلًا في gallery-data.js. لا يوجد زر إضافة للزوار.

احفظ نسخة من ملفاتك قبل تحديث النشر. الملف المضغوط يحتوي ملفات الموقع فقط، ولا يحتوي بيانات حجوزات العملاء أو بيانات دخول الإدارة.

تحديث تقييمات العملاء:
- قسم آراء العملاء يعرض أحدث التقييمات المنشورة من صفحة التقييمات.
- اكتب تقييمك: https://go-clean-bookings.mohamedood48.chatgpt.site/reviews
- الإدارة: https://go-clean-bookings.mohamedood48.chatgpt.site/admin/reviews
- رفع محتويات النسخة الجديدة على Cloudflare مطلوب لظهور القسم في موقعك الرئيسي.
- إذا تعذر تحميل الآراء، يظل رابط صفحة التقييمات متاحًا.

## GitHub repository

Static Arabic landing page for Go Clean Co., a mobile car wash brand.

### Technology
HTML, CSS, and vanilla JavaScript. No build step or package installation is required.

### Local preview
Serve this directory with a local static web server and open index.html.

### Project structure
- index.html: page content and sections
- styles.css and additional CSS files: responsive layout, themes, and animations
- config.js: public business links, service prices, and contact settings
- gallery-data.js and assets/: gallery images and videos
- reviews.js: retrieves published reviews from the external booking service

### Deployment
Upload the repository contents with index.html at the root. For GitHub Pages, use the main branch and root folder in the repository Pages settings.

The booking system and reviews API are hosted separately and are not included in this repository. Loading reviews on a new domain depends on the booking service allowing cross-origin requests; the reviews link remains available if loading fails.
