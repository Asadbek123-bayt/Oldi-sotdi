import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Scale,
  Share2,
  AlertTriangle,
  Phone,
  Send,
  ShieldCheck,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Cog,
  Car,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useVehicles } from '../context/VehiclesContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPriceUZS, formatMileage, formatListingDate } from '../utils/formatters';
import { VehicleCard } from '../components/VehicleCard';
import { ReportModal } from '../components/ReportModal';
import { ShareModal } from '../components/ShareModal';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicles, isFavorite, toggleFavorite, isInCompare, addToCompare, removeFromCompare, incrementViews, addRecentlyViewed } = useVehicles();
  const { t, language } = useLanguage();

  const vehicle = vehicles.find((v) => v.id === id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Credit Calculator state (in UZS)
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [creditPeriodMonths, setCreditPeriodMonths] = useState(36);
  const annualInterestRate = 24; // 24% typical bank auto loan in UZ

  useEffect(() => {
    if (vehicle) {
      incrementViews(vehicle.id);
      addRecentlyViewed(vehicle);
      setActiveImageIndex(0);
      setShowPhone(false);
      window.scrollTo(0, 0);
    }
  }, [id]);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-gray-200">
          <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#102A43] mb-2">Avtomobil topilmadi</h2>
          <p className="text-sm text-gray-500 mb-6">Ushbu e'lon o'chirilgan yoki mavjud emas.</p>
          <Link
            to="/vehicles"
            className="px-6 py-2.5 rounded-xl bg-[#1769AA] text-white font-bold text-sm inline-block"
          >
            Katalogga qaytish
          </Link>
        </div>
      </div>
    );
  }

  const favoriteActive = isFavorite(vehicle.id);
  const compareActive = isInCompare(vehicle.id);
  const isSold = vehicle.status === 'sold';

  // Similar vehicles (same brand or price range)
  const similarVehicles = vehicles
    .filter((v) => v.id !== vehicle.id && v.status === 'approved' && (v.brand_name === vehicle.brand_name || Math.abs(v.price_uzs - vehicle.price_uzs) < 30000000))
    .slice(0, 4);

  // Credit calculator formulas
  const downPaymentAmount = Math.round((vehicle.price_uzs * downPaymentPercent) / 100);
  const loanAmount = vehicle.price_uzs - downPaymentAmount;
  const monthlyInterestRate = annualInterestRate / 12 / 100;
  const monthlyPayment = loanAmount > 0
    ? Math.round((loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, creditPeriodMonths)) /
        (Math.pow(1 + monthlyInterestRate, creditPeriodMonths) - 1))
    : 0;

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#1769AA]">Bosh sahifa</Link>
          <span>/</span>
          <Link to="/vehicles" className="hover:text-[#1769AA]">Avtomobillar</Link>
          <span>/</span>
          <Link to={`/vehicles?brand=${vehicle.brand_name}`} className="hover:text-[#1769AA]">{vehicle.brand_name}</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold truncate max-w-xs">{vehicle.model_name} {vehicle.year}</span>
        </nav>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#102A43]">
                {vehicle.brand_name} {vehicle.model_name} {vehicle.year}
              </h1>
              {isSold && (
                <span className="px-3 py-1 rounded-lg bg-red-600 text-white font-black text-xs uppercase">
                  {t('badge_sold')}
                </span>
              )}
              {vehicle.is_premium && (
                <span className="px-3 py-1 rounded-lg bg-amber-500 text-white font-black text-xs uppercase">
                  VIP
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {vehicle.region}, {vehicle.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {formatListingDate(vehicle.created_at, language)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                {vehicle.views_count} marta ko'rildi
              </span>
              <span>ID: #{vehicle.id.slice(-6)}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => compareActive ? removeFromCompare(vehicle.id) : addToCompare(vehicle)}
              className={`p-3 rounded-2xl border font-bold text-xs flex items-center gap-2 transition-all ${
                compareActive
                  ? 'bg-blue-50 border-[#1769AA] text-[#1769AA]'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              title="Taqqoslash"
            >
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Taqqoslash</span>
            </button>

            <button
              onClick={() => toggleFavorite(vehicle.id)}
              className={`p-3 rounded-2xl border font-bold text-xs flex items-center gap-2 transition-all ${
                favoriteActive
                  ? 'bg-red-50 border-red-500 text-red-600'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              title="Sevimlilar"
            >
              <Heart className={`w-4 h-4 ${favoriteActive ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Saqlash</span>
            </button>

            <button
              onClick={() => setShareModalOpen(true)}
              className="p-3 rounded-2xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all font-bold text-xs flex items-center gap-2"
              title="Ulashish"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Ulashish</span>
            </button>

            <button
              onClick={() => setReportModalOpen(true)}
              className="p-3 rounded-2xl bg-white border border-gray-200 text-red-500 hover:bg-red-50 transition-all"
              title="Shikoyat qilish"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Images + Specs + Description): 2 Cols */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Photo Gallery */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/80 shadow-xs">
              {/* Main Active Photo */}
              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-gray-900 mb-4 group">
                <img
                  src={vehicle.images[activeImageIndex] || vehicle.images[0]}
                  alt={`${vehicle.brand_name} ${vehicle.model_name}`}
                  className="w-full h-full object-cover"
                />

                {/* Left/Right Carousel Controls */}
                {vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev === 0 ? vehicle.images.length - 1 : prev - 1))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex((prev) => (prev === vehicle.images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-xs hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-bold">
                  {activeImageIndex + 1} / {vehicle.images.length}
                </div>
              </div>

              {/* Thumbnails Row */}
              {vehicle.images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-2">
                  {vehicle.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx ? 'border-[#1769AA] scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Technical Specifications Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
              <h2 className="text-xl font-black text-[#102A43] mb-6 flex items-center gap-2">
                <Cog className="w-5 h-5 text-[#1769AA]" />
                <span>Texnik xususiyatlari</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Marka:</span>
                  <span className="font-bold text-gray-900">{vehicle.brand_name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Model:</span>
                  <span className="font-bold text-gray-900">{vehicle.model_name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Ishlab chiqarilgan yili:</span>
                  <span className="font-bold text-gray-900">{vehicle.year}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Yurgan masofasi:</span>
                  <span className="font-bold text-gray-900">{formatMileage(vehicle.mileage)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Kuzov turi:</span>
                  <span className="font-bold text-gray-900">{t(`body_${vehicle.body_type}`)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Yoqilg'i turi:</span>
                  <span className="font-bold text-gray-900">{t(`fuel_${vehicle.fuel_type}`)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Uzatmalar qutisi:</span>
                  <span className="font-bold text-gray-900">{t(`trans_${vehicle.transmission}`)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Dvigatel hajmi:</span>
                  <span className="font-bold text-gray-900">{vehicle.engine_volume} L</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Rangi:</span>
                  <span className="font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border border-gray-300" style={{ backgroundColor: vehicle.color_hex || '#999' }} />
                    {vehicle.color}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Joylashuv:</span>
                  <span className="font-bold text-gray-900">{vehicle.region}, {vehicle.city}</span>
                </div>
              </div>
            </div>

            {/* 3. Equipments & Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
                <h2 className="text-xl font-black text-[#102A43] mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Qulayliklar va komplektatsiya</span>
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {vehicle.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 text-xs font-semibold text-gray-800 border border-gray-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Seller Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
              <h2 className="text-xl font-black text-[#102A43] mb-4">Sotuvchi izohi</h2>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
                {vehicle.description || "Izoh qoldirilmagan."}
              </div>
            </div>

            {/* 5. Auto Credit Loan Calculator (UZS) */}
            <div className="bg-linear-to-br from-blue-900 to-[#102A43] rounded-3xl p-6 sm:p-8 text-white shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black">{t('credit_calc_title')}</h3>
                  <p className="text-xs text-blue-200">O'zbekiston banklari orqali taxminiy oylik to'lov</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Down payment slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-blue-200">{t('credit_down_payment')}: {downPaymentPercent}%</span>
                    <span className="text-emerald-400">{formatPriceUZS(downPaymentAmount, language)}</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="70"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>

                {/* Period slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-blue-200">{t('credit_period')}: {creditPeriodMonths} {t('credit_months')}</span>
                    <span className="text-blue-200">Yillik 24%</span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="60"
                    step="12"
                    value={creditPeriodMonths}
                    onChange={(e) => setCreditPeriodMonths(Number(e.target.value))}
                    className="w-full accent-emerald-400"
                  />
                </div>
              </div>

              {/* Monthly Payment Result Box */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10">
                <div>
                  <span className="text-xs text-blue-200 uppercase font-bold tracking-wider block">
                    {t('credit_monthly_payment')}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                    {formatPriceUZS(monthlyPayment, language)} / oy
                  </span>
                </div>
                <div className="text-xs text-right text-blue-300">
                  <span>Kredit summasi: {formatPriceUZS(loanAmount, language)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Price + Seller Box): 1 Col */}
          <div className="space-y-6">
            {/* Price & Contact Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-md sticky top-28 space-y-6">
              {/* Price */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  Narxi (Faqat UZS so'mda)
                </span>
                <div className="text-3xl sm:text-4xl font-black text-[#102A43] tracking-tight">
                  {formatPriceUZS(vehicle.price_uzs, language)}
                </div>
                {vehicle.is_negotiable && (
                  <span className="inline-block mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {t('negotiable')}
                  </span>
                )}
              </div>

              {/* Phone reveal button */}
              <div>
                {showPhone ? (
                  <a
                    href={`tel:${vehicle.contact_phone.replace(/\D/g, '')}`}
                    className="w-full h-14 rounded-2xl bg-[#16A36A] hover:bg-[#138A59] text-white font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-emerald-950/20 transition-all"
                  >
                    <Phone className="w-6 h-6" />
                    <span>{vehicle.contact_phone}</span>
                  </a>
                ) : (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="w-full h-14 rounded-2xl bg-[#16A36A] hover:bg-[#138A59] text-white font-black text-base flex items-center justify-center gap-3 shadow-lg shadow-emerald-950/20 transition-all hover:scale-102"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{t('seller_show_phone')}</span>
                  </button>
                )}
              </div>

              {/* Telegram direct button */}
              {vehicle.contact_telegram && (
                <a
                  href={`https://t.me/${vehicle.contact_telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-12 rounded-2xl bg-[#229ED9] hover:bg-[#1E8BC0] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('seller_write_tg')} ({vehicle.contact_telegram})</span>
                </a>
              )}

              {/* Seller profile info */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1769AA] flex items-center justify-center font-black text-lg border border-blue-100">
                    {vehicle.contact_name ? vehicle.contact_name[0] : 'S'}
                  </div>
                  <div>
                    <h4 className="font-black text-base text-[#102A43] flex items-center gap-1.5">
                      {vehicle.contact_name}
                      {vehicle.is_verified_seller && (
                        <span title="Tasdiqlangan sotuvchi">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {vehicle.is_verified_seller ? "Tasdiqlangan sotuvchi" : "Jismoniy shaxs"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-600 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Hudud:</span>
                    <span className="font-bold text-gray-900">{vehicle.region}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shahar:</span>
                    <span className="font-bold text-gray-900">{vehicle.city}</span>
                  </div>
                </div>
              </div>

              {/* Safety notice */}
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200/60 text-xs text-amber-900 space-y-1.5">
                <span className="font-bold block flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Xavfsizlik eslatmasi:
                </span>
                <p className="text-amber-800 leading-relaxed">
                  Hech qachon avtomobilni ko'rmasdan oldindan to'lov qilmang. Barcha hisob-kitoblar faqat milliy valyuta (so'm)da amalga oshiriladi.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Cars Section */}
        {similarVehicles.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-[#102A43]">
                {t('similar_cars')}
              </h3>
              <Link
                to={`/vehicles?brand=${vehicle.brand_name}`}
                className="text-sm font-bold text-[#1769AA] hover:underline"
              >
                Barchasini ko'rish →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarVehicles.map((car) => (
                <VehicleCard key={car.id} vehicle={car} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ReportModal
        vehicle={vehicle}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      <ShareModal
        vehicle={vehicle}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
};
