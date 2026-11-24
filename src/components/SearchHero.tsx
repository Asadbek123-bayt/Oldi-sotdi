import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { APPROVED_BRANDS, UZBEKISTAN_REGIONS } from '../data/mockData';

export const SearchHero: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  // Active models based on chosen brand
  const activeBrandObj = APPROVED_BRANDS.find((b) => b.name === selectedBrand);
  const availableModels = activeBrandObj ? activeBrandObj.models : [];

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedBrand) params.append('brand', selectedBrand);
    if (selectedModel) params.append('model', selectedModel);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (minYear) params.append('minYear', minYear);
    if (maxYear) params.append('maxYear', maxYear);
    if (selectedRegion) params.append('region', selectedRegion);

    navigate(`/vehicles?${params.toString()}`);
  };

  const years = Array.from({ length: 30 }, (_, i) => 2025 - i);

  return (
    <div className="relative bg-linear-to-b from-[#102A43] via-[#0F3559] to-[#1769AA] text-white overflow-hidden py-14 sm:py-20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>O'zbekiston №1 Avtomobil Portali</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-4 text-white drop-shadow-xs">
            {t('hero_title')}
          </h1>

          <p className="text-base sm:text-lg text-blue-100 font-normal leading-relaxed max-w-2xl mx-auto mb-8">
            {t('hero_subtitle')}
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                const el = document.getElementById('search-panel');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-7 py-3.5 rounded-xl bg-white text-[#102A43] hover:bg-gray-100 font-bold text-sm shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-[#1769AA]" />
              <span>{t('hero_btn_search')}</span>
            </button>

            <button
              onClick={() => navigate('/post-ad')}
              className="px-7 py-3.5 rounded-xl bg-[#16A36A] hover:bg-[#138A59] text-white font-bold text-sm shadow-xl shadow-emerald-950/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>{t('hero_btn_post')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Panel Widget */}
        <div
          id="search-panel"
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-gray-800 border border-white/20 max-w-5xl mx-auto backdrop-blur-md"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Row 1: Brand, Model, Region */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Brand */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  {t('search_brand')}
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] focus:ring-2 focus:ring-blue-100 font-medium text-sm text-gray-800 bg-white"
                >
                  <option value="">{t('all_brands')}</option>
                  {APPROVED_BRANDS.map((b) => (
                    <option key={b.name} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  {t('search_model')}
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] focus:ring-2 focus:ring-blue-100 font-medium text-sm text-gray-800 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">{t('all_models')}</option>
                  {availableModels.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  {t('search_region')}
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] focus:ring-2 focus:ring-blue-100 font-medium text-sm text-gray-800 bg-white"
                >
                  <option value="">{t('all_regions')}</option>
                  {UZBEKISTAN_REGIONS.map((r) => (
                    <option key={r.id} value={r.name_uz}>
                      {language === 'uz' ? r.name_uz : r.name_ru}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Price range & Year range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Min Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  {t('search_price_from')} (so'm)
                </label>
                <input
                  type="number"
                  placeholder="30 000 000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] focus:ring-2 focus:ring-blue-100 font-medium text-sm text-gray-800 bg-white"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  {t('search_price_to')} (so'm)
                </label>
                <input
                  type="number"
                  placeholder="200 000 000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] focus:ring-2 focus:ring-blue-100 font-medium text-sm text-gray-800 bg-white"
                />
              </div>

              {/* Min Year */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  {t('search_year_from')}
                </label>
                <select
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] focus:ring-2 focus:ring-blue-100 font-medium text-sm text-gray-800 bg-white"
                >
                  <option value="">{t('from')}</option>
                  {years.map((y) => (
                    <option key={`min-${y}`} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Year */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  {t('search_year_to')}
                </label>
                <select
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                  className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] focus:ring-2 focus:ring-blue-100 font-medium text-sm text-gray-800 bg-white"
                >
                  <option value="">{t('to')}</option>
                  {years.map((y) => (
                    <option key={`max-${y}`} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Submit and Advanced Filters link */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate('/vehicles')}
                className="text-sm font-semibold text-[#1769AA] hover:text-[#102A43] flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Barcha filtrlarni ochish</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-10 h-13 rounded-xl bg-[#1769AA] hover:bg-[#102A43] text-white font-bold text-base shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span>{t('search_submit')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Trust Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="block text-2xl sm:text-3xl font-black text-white">12 400+</span>
            <span className="text-xs text-blue-200 mt-1 block">Faol e'lonlar</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="block text-2xl sm:text-3xl font-black text-emerald-400">100% UZS</span>
            <span className="text-xs text-blue-200 mt-1 block">Faqat so'mda</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="block text-2xl sm:text-3xl font-black text-white">14</span>
            <span className="text-xs text-blue-200 mt-1 block">Barcha viloyatlar</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="block text-2xl sm:text-3xl font-black text-amber-300">24/7</span>
            <span className="text-xs text-blue-200 mt-1 block">Moderatsiya</span>
          </div>
        </div>
      </div>
    </div>
  );
};
