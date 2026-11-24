import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Language } from '../types';
import { uz } from '../locales/uz';
import { ru } from '../locales/ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n, t: i18nT } = useTranslation();
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('avtobozor_lang');
    return (saved === 'ru' || saved === 'uz') ? saved : 'uz';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('avtobozor_lang', lang);
    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language, i18n]);

  // Safe translation helper with dictionary fallback
  const t = (key: string, params?: Record<string, string | number>): string => {
    const translated = i18nT(key, params);
    if (translated && translated !== key) {
      return translated;
    }
    const currentDict = language === 'ru' ? ru : uz;
    const fallback = (currentDict as Record<string, string>)[key];
    if (fallback) {
      if (params) {
        return Object.entries(params).reduce(
          (str, [k, v]) => str.replace(new RegExp(`{{${k}}}`, 'g'), String(v)),
          fallback
        );
      }
      return fallback;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
