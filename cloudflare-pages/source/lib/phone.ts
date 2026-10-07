const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
const persianDigits = '۰۱۲۳۴۵۶۷۸۹';

export const egyptianPhoneMessage = 'رقم غير صحيح، لازم يكون رقم مصري بس.';

export function normalizeEgyptianMobile(value: string): string | null {
  const ascii = value
    .trim()
    .replace(/[٠-٩]/g, digit => String(arabicDigits.indexOf(digit)))
    .replace(/[۰-۹]/g, digit => String(persianDigits.indexOf(digit)));

  if (!/^[+\d\s().-]+$/.test(ascii)) return null;

  const digits = ascii.replace(/\D/g, '');
  const localNumber = digits.startsWith('0020')
    ? `0${digits.slice(4)}`
    : digits.startsWith('20')
      ? `0${digits.slice(2)}`
      : digits;

  return /^01[0125]\d{8}$/.test(localNumber) ? localNumber : null;
}
