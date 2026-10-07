export const zone = 'Africa/Cairo';
export function dayKey(value: number | Date = Date.now()) {
  return new Intl.DateTimeFormat('en-CA', {timeZone: zone, year:'numeric', month:'2-digit', day:'2-digit'}).format(value);
}
export function addDays(day: string, count: number) {
  const date = new Date(day + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() + count);
  return date.toISOString().slice(0,10);
}
export function dayLabel(day: string) {
  return new Date(day + 'T12:00:00Z').toLocaleDateString('ar-EG', {timeZone:zone, weekday:'long', day:'numeric', month:'long', year:'numeric'});
}

export function firstBookingDay(now: number = Date.now()) {
  return addDays(dayKey(now), 1);
}
export function isAdvanceBookingDay(day: string, now: number = Date.now()) {
  return /^\d{4}-\d{2}-\d{2}$/.test(day) && day >= firstBookingDay(now);
}
export const advanceBookingNotice = 'الحجز لازم يكون قبل الزيارة بيوم على الأقل. حجز نفس اليوم غير متاح؛ اختار من بكرة أو أي يوم بعده بتوقيت القاهرة. مواعيد بداية الزيارة من ٥ مساءً لحد ١٢ بالليل.';

export const firstBookingHour = 17;

export const lastBookingHour = 24;
