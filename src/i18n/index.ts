import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { uz } from '../locales/uz';
import { ru } from '../locales/ru';

const savedLang = typeof window !== 'undefined' ? (localStorage.getItem('avtobozor_lang') || 'uz') : 'uz';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      uz: {
        translation: uz,
      },
      ru: {
        translation: ru,
      },
    },
    lng: savedLang === 'ru' ? 'ru' : 'uz',
    fallbackLng: 'uz',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
