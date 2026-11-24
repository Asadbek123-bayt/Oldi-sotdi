import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Truck, Flame, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { POPULAR_QUICK_MODELS } from '../data/mockData';

export const QuickCategories: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const bodyTypes = [
    { type: 'sedan', name: t('body_sedan'), count: '8 420' },
    { type: 'universal', name: t('body_universal'), count: '1 150' },
    { type: 'hatchback', name: t('body_hatchback'), count: '2 310' },
    { type: 'suv', name: t('body_suv'), count: '1 890' },
    { type: 'miniven', name: t('body_miniven'), count: '3 640' },
    { type: 'tijorat', name: t('body_tijorat'), count: '1 430' },
  ];

  return (
    <section className="py-12 bg-gray-50 border-b border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Popular Model Quick Buttons */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-black text-[#102A43] flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>{t('popular_cars')}</span>
            </h2>
            <button
              onClick={() => navigate('/vehicles')}
              className="text-xs sm:text-sm font-bold text-[#1769AA] hover:underline"
            >
              {t('all_cars')} →
            </button>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            {POPULAR_QUICK_MODELS.map((model) => (
              <button
                key={model.name}
                onClick={() => navigate(`/vehicles?model=${model.name}`)}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#1769AA] text-gray-800 hover:text-white font-bold text-xs sm:text-sm border border-gray-200 hover:border-[#1769AA] shadow-2xs hover:shadow-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span>{model.name}</span>
                <span className="text-[11px] font-semibold text-gray-400 group-hover:text-blue-100 bg-gray-100 group-hover:bg-blue-800/40 px-2 py-0.5 rounded-full">
                  {model.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Body Types Cards */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#102A43] mb-5 flex items-center gap-2">
            <Car className="w-5 h-5 text-[#1769AA]" />
            <span>Kuzov turlari</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {bodyTypes.map((item) => (
              <div
                key={item.type}
                onClick={() => navigate(`/vehicles?bodyType=${item.type}`)}
                className="bg-white p-4 rounded-2xl border border-gray-200/80 hover:border-[#1769AA] shadow-2xs hover:shadow-lg transition-all duration-200 cursor-pointer text-center group"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 group-hover:bg-[#1769AA] text-[#1769AA] group-hover:text-white flex items-center justify-center transition-colors mb-3">
                  {item.type === 'tijorat' ? (
                    <Truck className="w-6 h-6" />
                  ) : (
                    <Car className="w-6 h-6" />
                  )}
                </div>
                <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#1769AA] transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-400 mt-1">{item.count} e'lon</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
