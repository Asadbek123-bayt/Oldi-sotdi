export interface Dealership {
  id: string;
  name: string;
  region: string;
  city: string;
  address: string;
  phone: string;
  telegram?: string;
  working_hours: string;
  image: string;
  image_url: string;
  verified: boolean;
  is_verified: boolean;
  brands: string[];
  cars_count: number;
  description_uz: string;
  description_ru: string;
}

const RAW_DEALERSHIPS = [
  {
    id: 'dealer-1',
    name: "Driver's Village Avtosaloni",
    region: 'Toshkent shahri',
    city: 'Sergeli',
    address: 'Toshkent sh., Sergeli tumani, Yangi Sergeli ko‘chasi, 2-uy',
    phone: '+998 (71) 200-70-70',
    telegram: 'driversvillage_uz',
    working_hours: '09:00 - 19:00 (Har kuni)',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    verified: true,
    brands: ['Chevrolet', 'Ravon'],
    cars_count: 85,
    description_uz: "O'zbekistondagi eng yirik rasmiy dilerlik markazlaridan biri. Barcha yangi va tekshirilgan ikkilamchi bozor avtomobillari kafolat bilan sotiladi.",
    description_ru: "Один из крупнейших официальных дилерских центров в Узбекистане. Продажа новых и проверенных авто с гарантией."
  },
  {
    id: 'dealer-2',
    name: 'Rohat Avto Markazi',
    region: 'Toshkent shahri',
    city: 'Bektemir',
    address: 'Bektemir tumani, Rohat aylanma yo‘li, 15-bino',
    phone: '+998 (71) 230-44-55',
    telegram: 'rohat_avto',
    working_hours: '08:30 - 18:30 (Dush - Shan)',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    verified: true,
    brands: ['Chevrolet'],
    cars_count: 62,
    description_uz: "Rohat doirasidagi zamonaviy avtosalon. Cobalt, Gentra, Tracker va Onix modellari mavjud. Rasmiylashtirish 1 soat ichida.",
    description_ru: "Современный автосалон у круга Рохат. В наличии Cobalt, Gentra, Tracker и Onix. Оформление за 1 час."
  },
  {
    id: 'dealer-3',
    name: 'Sergeli Mashina Bozori Dilerlik Zonasi',
    region: 'Toshkent shahri',
    city: 'Sergeli',
    address: 'Sergeli tumani, Avtomobil bozori majmuasi',
    phone: '+998 (90) 123-99-00',
    telegram: 'sergeli_avto_bozor',
    working_hours: '08:00 - 18:00 (Seshanba - Yakshanba)',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    verified: true,
    brands: ['Chevrolet', 'Ravon', 'Daewoo'],
    cars_count: 140,
    description_uz: "O'zbekistonning bosh avtomobil savdo markazidagi sertifikatlangan dilerlar maydoni. Hujjatlari toza, sinovdan o'tgan mashinalar.",
    description_ru: "Сертифицированная дилерская зона на главном авторынке страны. Автомобили с чистой историей."
  },
  {
    id: 'dealer-4',
    name: 'Samarqand Avto Trade',
    region: 'Samarqand',
    city: 'Samarqand sh.',
    address: 'Samarqand sh., Spitamen ko‘chasi, 148-uy',
    phone: '+998 (66) 234-11-22',
    telegram: 'samarqand_avtotrade',
    working_hours: '09:00 - 18:00 (Har kuni)',
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80',
    verified: true,
    brands: ['Chevrolet', 'Ravon'],
    cars_count: 48,
    description_uz: "Samarqand viloyati aholisi uchun qulay xarid sharoitlari. Avtokredit va lizing xizmatlari bilan ko'maklashamiz.",
    description_ru: "Удобные условия покупки для жителей Самаркандской области. Помощь в автокредитовании и лизинге."
  },
  {
    id: 'dealer-5',
    name: 'Asaka Motors Diler Markazi',
    region: 'Andijon',
    city: 'Asaka',
    address: 'Asaka sh., Avtomobilchilar ko‘chasi, 1-bino',
    phone: '+998 (74) 225-88-99',
    telegram: 'asaka_motors_dealer',
    working_hours: '09:00 - 18:00 (Dushanba - Shanba)',
    image: 'https://images.unsplash.com/photo-1541348263662-e0c82661210e?auto=format&fit=crop&w=1200&q=80',
    verified: true,
    brands: ['Chevrolet'],
    cars_count: 53,
    description_uz: "Zavod yaqinidagi rasmiy diler. Yangi avtomobillar, original ehtiyot qismlari va professional servis xizmati.",
    description_ru: "Официальный дилер рядом с заводом. Новые автомобили, оригинальные запчасти и сервис."
  },
  {
    id: 'dealer-6',
    name: 'Farg‘ona Vodiy Avto',
    region: 'Farg‘ona',
    city: 'Farg‘ona sh.',
    address: 'Farg‘ona sh., Al-Farg‘oniy ko‘chasi, 89',
    phone: '+998 (73) 244-33-22',
    telegram: 'vodiy_avto_fargona',
    working_hours: '09:00 - 18:30 (Har kuni)',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    verified: true,
    brands: ['Chevrolet', 'Daewoo'],
    cars_count: 39,
    description_uz: "Vodiy bo'yicha ishonchli avtosalon. Damas, Labo, Cobalt va Gentra avtomobillari katta assortimentda.",
    description_ru: "Надежный автосалон в Долине. Большой выбор Damas, Labo, Cobalt и Gentra."
  }
];

export const DEALERSHIPS_DATA: Dealership[] = RAW_DEALERSHIPS.map((d) => ({
  ...d,
  image_url: d.image,
  is_verified: d.verified,
}));

export const UZBEKISTAN_DEALERSHIPS: Dealership[] = DEALERSHIPS_DATA;

