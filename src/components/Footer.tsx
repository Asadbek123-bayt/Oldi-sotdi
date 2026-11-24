import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, ShieldCheck, Heart, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  const popularModels = [
    { name: 'Chevrolet Cobalt', query: 'Cobalt' },
    { name: 'Chevrolet Gentra', query: 'Gentra' },
    { name: 'Chevrolet Damas', query: 'Damas' },
    { name: 'Chevrolet Spark', query: 'Spark' },
    { name: 'Chevrolet Onix', query: 'Onix' },
    { name: 'Chevrolet Tracker', query: 'Tracker' },
    { name: 'Ravon R3 Nexia', query: 'R3' },
    { name: 'Daewoo Matiz', query: 'Matiz' },
  ];

  return (
    <footer className="bg-[#102A43] text-gray-300 pt-16 pb-12 border-t border-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Banner */}
        <div className="bg-blue-900/40 rounded-2xl p-6 sm:p-8 mb-12 border border-blue-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">
                {language === 'uz'
                  ? "Barcha narxlar faqat so'mda (UZS)!"
                  : "Все цены только в узбекских сумах (UZS)!"}
              </h4>
              <p className="text-gray-400 text-sm mt-0.5">
                {language === 'uz'
                  ? "O'zbekiston qonunchiligiga to'liq muvofiq, xavfsiz va ishonchli bitimlar platformasi."
                  : "Полное соответствие законодательству РУз, безопасные и надежные сделки."}
              </p>
            </div>
          </div>
          <Link
            to="/post-ad"
            className="shrink-0 px-6 py-3 rounded-xl bg-[#16A36A] hover:bg-[#138A59] text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all hover:scale-105"
          >
            {t('nav_post_ad')}
          </Link>
        </div>

        {/* 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1769AA] flex items-center justify-center text-white">
                <Car className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white">
                AVTOBOZOR<span className="text-[#16A36A]">.UZ</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {language === 'uz'
                ? "O'zbekiston bo'ylab avtomobil sotib olish va sotish uchun eng qulay va ishonchli platforma. Faqat tasdiqlangan modellar va kafolatlangan ma'lumotlar."
                : "Удобная и надежная платформа купли-продажи автомобилей по всему Узбекистану. Только проверенные модели и актуальные цены."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://t.me/avtobozor_uz"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-blue-900/50 hover:bg-[#1769AA] text-white flex items-center justify-center transition-colors"
                title="Telegram"
              >
                <Send className="w-5 h-5" />
              </a>
              <div className="text-xs text-gray-400">
                <p className="font-semibold text-white">Telegram kanal</p>
                <p>@avtobozor_uz</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">
              {t('nav_cars')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/vehicles" className="hover:text-white transition-colors">
                  {t('all_cars')}
                </Link>
              </li>
              <li>
                <Link to="/dealerships" className="hover:text-white transition-colors">
                  {t('nav_dealerships')}
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">
                  {t('nav_compare')}
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-white transition-colors">
                  {t('nav_favorites')}
                </Link>
              </li>
              <li>
                <Link to="/post-ad" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                  + {t('nav_post_ad')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Models */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">
              {t('popular_cars')}
            </h4>
            <ul className="space-y-2 text-sm">
              {popularModels.map((item) => (
                <li key={item.query}>
                  <Link
                    to={`/vehicles?model=${item.query}`}
                    className="hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>{item.name}</span>
                    <span className="text-xs text-gray-500">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts & Support */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">
              {t('footer_contact')}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <span className="text-gray-400 block text-xs">Qo'llab-quvvatlash (24/7):</span>
                  <a href="tel:+998712000000" className="text-white font-bold hover:underline">
                    +998 (71) 200-00-00
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#1769AA] shrink-0 mt-1" />
                <div>
                  <span className="text-gray-400 block text-xs">Email pochta:</span>
                  <span className="text-white">support@avtobozor.uz</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <div>
                  <span className="text-gray-400 block text-xs">Bosh ofis:</span>
                  <span className="text-gray-300">Toshkent sh., Amir Temur shox ko'chasi 107B</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2025-2026 AVTOBOZOR.UZ. {t('footer_rights')}</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer">{t('footer_privacy')}</span>
            <span className="hover:text-gray-400 cursor-pointer">{t('footer_terms')}</span>
            <span className="hover:text-gray-400 cursor-pointer">{t('footer_safety')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
