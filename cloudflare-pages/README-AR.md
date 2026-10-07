# نشر تطبيق Go Clean على Cloudflare Pages

فرع `cloudflare-pages` يشغّل الموقع التعريفي وصفحات الحجز والإدارة والتقييمات على Cloudflare. الفرع الرئيسي `main` يظل للموقع التعريفي كما هو.

إعدادات المشروع:
- اسم Pages: `gocleanco-bookings`
- Root directory: `cloudflare-pages`
- Build command: `cd source && npm ci && npm run build:pages`
- Build output: `source/pages-dist`
- Node.js: `22.13.0`

بعد نجاح أول بناء، أنشئ D1 جديدة وفارغة، اربطها باسم `DB`، ونفّذ `source/drizzle/0000_broad_the_twelve.sql` مرة واحدة. أضف سرًا `ADMIN_PASSWORD` بطول 20 حرفًا على الأقل، ومتغير `BOOKING_ENABLED=false`. قاعدة البيانات تبدأ فارغة والحجز يظل متوقفًا كما طلبت.

الصفحات: `/booking` و`/admin` و`/reviews`. عند الاستعداد لفتح الحجز، غيّر `BOOKING_ENABLED` إلى `true` من إعدادات Cloudflare.
