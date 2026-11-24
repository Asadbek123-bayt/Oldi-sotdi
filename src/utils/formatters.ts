import { Language } from '../types';

/**
 * Format price strictly in Uzbek Som (UZS) with space thousand separators
 * Example: 120000000 -> "120 000 000 so'm" or "120 000 000 сум"
 */
export const formatPriceUZS = (price: number, lang: Language = 'uz'): string => {
  if (isNaN(price)) return `0 ${lang === 'ru' ? 'сум' : "so'm"}`;
  
  const formattedNumber = Math.round(price)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    
  const suffix = lang === 'ru' ? 'сум' : "so'm";
  return `${formattedNumber} ${suffix}`;
};

/**
 * Format mileage with thousand separator
 * Example: 45000 -> "45 000 km" / "45 000 км"
 */
export const formatMileage = (mileage: number, lang: Language = 'uz'): string => {
  if (isNaN(mileage)) return `0 ${lang === 'ru' ? 'км' : 'km'}`;
  
  const formattedNumber = Math.round(mileage)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    
  const suffix = lang === 'ru' ? 'км' : 'km';
  return `${formattedNumber} ${suffix}`;
};

/**
 * Format date in friendly human readable format
 */
export const formatListingDate = (dateString: string, lang: Language = 'uz'): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const isToday = 
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isYesterday = 
    date.getDate() === now.getDate() - 1 &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;

  if (isToday) {
    return lang === 'ru' ? `Сегодня, ${time}` : `Bugun, ${time}`;
  }

  if (isYesterday) {
    return lang === 'ru' ? `Вчера, ${time}` : `Kecha, ${time}`;
  }

  const monthsUz = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
  const monthsRu = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  const monthName = lang === 'ru' ? monthsRu[date.getMonth()] : monthsUz[date.getMonth()];
  return `${date.getDate()}-${monthName}, ${date.getFullYear()}`;
};

/**
 * Clean and format Uzbek phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('998')) {
    return `+998 (${cleaned.slice(3, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(10, 12)}`;
  }
  return phone;
};
