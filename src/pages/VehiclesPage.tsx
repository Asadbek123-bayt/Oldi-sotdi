import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  BookmarkPlus,
  Grid,
  List,
  Check,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { VehicleCard } from '../components/VehicleCard';
import { useVehicles } from '../context/VehiclesContext';
import { useLanguage } from '../context/LanguageContext';
import { APPROVED_BRANDS, UZBEKISTAN_REGIONS } from '../data/mockData';
import { FuelType, TransmissionType, BodyType } from '../types';
import { formatPriceUZS } from '../utils/formatters';

export const VehiclesPage: React.FC = () => {
  const { approvedVehicles, addSavedSearch } = useVehicles();
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search filter states initialized from query params
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [selectedModel, setSelectedModel] = useState(searchParams.get('model') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [minYear, setMinYear] = useState(searchParams.get('minYear') || '');
  const [maxYear, setMaxYear] = useState(searchParams.get('maxYear') || '');
  const [fuelType, setFuelType] = useState<FuelType | ''>((searchParams.get('fuelType') as any) || '');
  const [transmission, setTransmission] = useState<TransmissionType | ''>((searchParams.get('transmission') as any) || '');
  const [bodyType, setBodyType] = useState<BodyType | ''>((searchParams.get('bodyType') as any) || '');
  const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || '');
  const [sortBy, setSortBy] = useState<'cheap' | 'expensive' | 'newest' | 'popular'>(
    (searchParams.get('sortBy') as any) || 'newest'
  );
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true');
  const [textSearch, setTextSearch] = useState(searchParams.get('q') || '');

  const [savedSearchSuccess, setSavedSearchSuccess] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBrand) params.set('brand', selectedBrand);
    if (selectedModel) params.set('model', selectedModel);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (minYear) params.set('minYear', minYear);
    if (maxYear) params.set('maxYear', maxYear);
    if (fuelType) params.set('fuelType', fuelType);
    if (transmission) params.set('transmission', transmission);
    if (bodyType) params.set('bodyType', bodyType);
    if (selectedRegion) params.set('region', selectedRegion);
    if (sortBy) params.set('sortBy', sortBy);
    if (verifiedOnly) params.set('verified', 'true');
    if (textSearch) params.set('q', textSearch);

    setSearchParams(params, { replace: true });
  }, [
    selectedBrand,
    selectedModel,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    fuelType,
    transmission,
    bodyType,
    selectedRegion,
    sortBy,
    verifiedOnly,
    textSearch,
  ]);

  // Available models based on chosen brand
  const activeBrandObj = APPROVED_BRANDS.find((b) => b.name === selectedBrand);
  const availableModels = activeBrandObj ? activeBrandObj.models : [];

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel('');
  };

  const handleResetFilters = () => {
    setSelectedBrand('');
    setSelectedModel('');
    setMinPrice('');
    setMaxPrice('');
    setMinYear('');
    setMaxYear('');
    setFuelType('');
    setTransmission('');
    setBodyType('');
    setSelectedRegion('');
    setVerifiedOnly(false);
    setTextSearch('');
    setSortBy('newest');
  };

  const handleSaveSearch = () => {
    const title = `${selectedBrand || 'Barcha'} ${selectedModel || ''} (${selectedRegion || 'O\'zbekiston'})`.trim();
    addSavedSearch(title, {
      brand: selectedBrand,
      model: selectedModel,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minYear: minYear ? Number(minYear) : undefined,
      maxYear: maxYear ? Number(maxYear) : undefined,
      fuelType,
      transmission,
      bodyType,
      region: selectedRegion,
    });
    setSavedSearchSuccess(true);
    setTimeout(() => setSavedSearchSuccess(false), 2500);
  };

  // Filter & sort logic
  const filteredVehicles = useMemo(() => {
    return approvedVehicles
      .filter((car) => {
        if (selectedBrand && car.brand_name.toLowerCase() !== selectedBrand.toLowerCase()) return false;
        if (selectedModel && car.model_name.toLowerCase() !== selectedModel.toLowerCase()) return false;
        if (minPrice && car.price_uzs < Number(minPrice)) return false;
        if (maxPrice && car.price_uzs > Number(maxPrice)) return false;
        if (minYear && car.year < Number(minYear)) return false;
        if (maxYear && car.year > Number(maxYear)) return false;
        if (fuelType && car.fuel_type !== fuelType) return false;
        if (transmission && car.transmission !== transmission) return false;
        if (bodyType && car.body_type !== bodyType) return false;
        if (selectedRegion && !car.region.toLowerCase().includes(selectedRegion.toLowerCase())) return false;
        if (verifiedOnly && !car.is_verified_seller) return false;
        if (textSearch) {
          const q = textSearch.toLowerCase();
          const matchTitle = `${car.brand_name} ${car.model_name} ${car.year}`.toLowerCase().includes(q);
          const matchDesc = car.description.toLowerCase().includes(q);
          const matchCity = car.city.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCity) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'cheap') return a.price_uzs - b.price_uzs;
        if (sortBy === 'expensive') return b.price_uzs - a.price_uzs;
        if (sortBy === 'popular') return b.views_count - a.views_count;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [
    approvedVehicles,
    selectedBrand,
    selectedModel,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    fuelType,
    transmission,
    bodyType,
    selectedRegion,
    verifiedOnly,
    textSearch,
    sortBy,
  ]);

  const years = Array.from({ length: 30 }, (_, i) => 2025 - i);

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Breadcrumbs */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#102A43]">
              {t('all_cars')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {filteredVehicles.length} {language === 'uz' ? "ta avtomobil topildi" : "автомобилей найдено"} (Faqat UZS so'mda)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Save search button */}
            <button
              onClick={handleSaveSearch}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs sm:text-sm border border-gray-200 shadow-2xs flex items-center gap-2 transition-all"
            >
              {savedSearchSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Qidiruv saqlandi!</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4 text-[#1769AA]" />
                  <span>Qidiruvni saqlash</span>
                </>
              )}
            </button>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2.5 rounded-xl bg-[#1769AA] text-white font-bold text-xs sm:text-sm flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtrlar</span>
            </button>
          </div>
        </div>

        {/* Layout: Sidebar Filter + Car Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs sticky top-28 space-y-6 max-h-[calc(100vh-140px)] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-black text-lg text-[#102A43] flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#1769AA]" />
                  <span>Filtrlar</span>
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
                  title="Tozalash"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tozalash</span>
                </button>
              </div>

              {/* Text Search */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Qidiruv so'zi
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={textSearch}
                    onChange={(e) => setTextSearch(e.target.value)}
                    placeholder="Masalan: Cobalt, oq rang..."
                    className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 focus:border-[#1769AA] text-sm text-gray-800"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {t('search_brand')}
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => handleBrandChange(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-[#1769AA] text-sm font-semibold text-gray-800 bg-white"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {t('search_model')}
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-[#1769AA] text-sm font-semibold text-gray-800 bg-white disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">{t('all_models')}</option>
                  {availableModels.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range (UZS) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Narx (so'm)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Dan"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-[#1769AA] text-xs font-semibold text-gray-800"
                  />
                  <input
                    type="number"
                    placeholder="Gacha"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-[#1769AA] text-xs font-semibold text-gray-800"
                  />
                </div>
              </div>

              {/* Year Range */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Yil
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                    className="w-full h-11 px-2 rounded-xl border border-gray-200 focus:border-[#1769AA] text-xs font-semibold text-gray-800 bg-white"
                  >
                    <option value="">{t('from')}</option>
                    {years.map((y) => (
                      <option key={`side-min-${y}`} value={y}>{y}</option>
                    ))}
                  </select>
                  <select
                    value={maxYear}
                    onChange={(e) => setMaxYear(e.target.value)}
                    className="w-full h-11 px-2 rounded-xl border border-gray-200 focus:border-[#1769AA] text-xs font-semibold text-gray-800 bg-white"
                  >
                    <option value="">{t('to')}</option>
                    {years.map((y) => (
                      <option key={`side-max-${y}`} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {t('fuel_type')}
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-[#1769AA] text-sm text-gray-800 bg-white"
                >
                  <option value="">Barchasi</option>
                  <option value="benzin">{t('fuel_benzin')}</option>
                  <option value="gaz_metan">{t('fuel_gaz_metan')}</option>
                  <option value="gaz_propan">{t('fuel_gaz_propan')}</option>
                  <option value="gibrid">{t('fuel_gibrid')}</option>
                  <option value="elektr">{t('fuel_elektr')}</option>
                </select>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {t('transmission')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransmission(transmission === 'mexanika' ? '' : 'mexanika')}
                    className={`h-10 rounded-xl border text-xs font-bold transition-all ${
                      transmission === 'mexanika'
                        ? 'border-[#1769AA] bg-blue-50 text-[#1769AA]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Mexanika
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransmission(transmission === 'avtomat' ? '' : 'avtomat')}
                    className={`h-10 rounded-xl border text-xs font-bold transition-all ${
                      transmission === 'avtomat'
                        ? 'border-[#1769AA] bg-blue-50 text-[#1769AA]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Avtomat
                  </button>
                </div>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Kuzov turi
                </label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-[#1769AA] text-sm text-gray-800 bg-white"
                >
                  <option value="">Barchasi</option>
                  <option value="sedan">{t('body_sedan')}</option>
                  <option value="universal">{t('body_universal')}</option>
                  <option value="hatchback">{t('body_hatchback')}</option>
                  <option value="suv">{t('body_suv')}</option>
                  <option value="miniven">{t('body_miniven')}</option>
                  <option value="tijorat">{t('body_tijorat')}</option>
                </select>
              </div>

              {/* Region */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {t('search_region')}
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-gray-200 focus:border-[#1769AA] text-sm text-gray-800 bg-white"
                >
                  <option value="">{t('all_regions')}</option>
                  {UZBEKISTAN_REGIONS.map((r) => (
                    <option key={`side-reg-${r.id}`} value={r.name_uz}>
                      {language === 'uz' ? r.name_uz : r.name_ru}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verified Seller Checkbox */}
              <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-[#1769AA] focus:ring-[#1769AA] w-4 h-4"
                />
                <span className="text-xs font-bold text-gray-800">Faqat tekshirilgan sotuvchilar</span>
              </label>
            </div>
          </div>

          {/* Main Vehicle Listings Column */}
          <div className="lg:col-span-3">
            {/* Sort Bar */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-2xs mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t('sort_by')}:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-9 px-3 rounded-lg border border-gray-200 text-xs font-bold text-gray-800 bg-white focus:border-[#1769AA]"
                >
                  <option value="newest">{t('sort_newest')}</option>
                  <option value="cheap">{t('sort_cheap')}</option>
                  <option value="expensive">{t('sort_expensive')}</option>
                  <option value="popular">{t('sort_popular')}</option>
                </select>
              </div>

              {/* Active Filter Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedBrand && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-[#1769AA] text-xs font-bold">
                    {selectedBrand}
                    <button onClick={() => setSelectedBrand('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedModel && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-[#1769AA] text-xs font-bold">
                    {selectedModel}
                    <button onClick={() => setSelectedModel('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedRegion && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-bold">
                    {selectedRegion}
                    <button onClick={() => setSelectedRegion('')}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(selectedBrand || selectedModel || selectedRegion || minPrice || maxPrice) && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-red-600 hover:underline font-semibold ml-1"
                  >
                    Barchasini tozalash
                  </button>
                )}
              </div>
            </div>

            {/* Vehicle Grid */}
            {filteredVehicles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#102A43] mb-2">{t('no_vehicles_found')}</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                  {language === 'uz'
                    ? "Siz tanlagan mezonlar bo'yicha hech qanday mashina topilmadi. Filtr parametrlarini o'zgartirib ko'ring."
                    : "По выбранным критериям автомобили не найдены. Попробуйте изменить параметры поиска."}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl bg-[#1769AA] text-white font-bold text-sm"
                >
                  Filtrlarni qayta o'rnatish
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs lg:hidden">
          <div className="bg-white w-full max-w-sm h-full p-6 overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-black text-lg text-[#102A43]">Filtrlar</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Same filter inputs for mobile */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Marka</label>
              <select
                value={selectedBrand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-gray-200"
              >
                <option value="">Barchasi</option>
                {APPROVED_BRANDS.map((b) => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedBrand}
                className="w-full h-11 px-3 rounded-xl border border-gray-200"
              >
                <option value="">Barchasi</option>
                {availableModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">Hudud</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-gray-200"
              >
                <option value="">Barcha hududlar</option>
                {UZBEKISTAN_REGIONS.map((r) => (
                  <option key={`mob-reg-${r.id}`} value={r.name_uz}>{r.name_uz}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full h-12 rounded-xl bg-[#1769AA] text-white font-bold text-sm shadow-md mt-6"
            >
              Natijalarni ko'rish ({filteredVehicles.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
