import {env} from 'cloudflare:workers';
import Booking from '../ui';
import {Header} from '../ui';

export const dynamic = 'force-dynamic';

export default function Page() {
  const enabled = (env as unknown as Record<string, string | undefined>).BOOKING_ENABLED === 'true';
  if (enabled) return <Booking/>;
  return <><Header/><main><span className="eyebrow">GO CLEAN CO.</span><section className="panel"><h1>الحجز متوقف مؤقتًا</h1><p>هنعلن هنا أول ما نفتح الحجز من جديد. تقدر تتواصل معنا للاستفسار.</p><a className="button" href="https://wa.me/201041958966">تواصل معنا على واتساب</a></section></main></>;
}
