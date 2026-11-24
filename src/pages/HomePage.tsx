import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  Wallet,
  Car,
  CheckCircle2,
} from 'lucide-react';
import { SearchHero } from '../components/SearchHero';
import { QuickCategories } from '../components/QuickCategories';
import { VehicleCard } from '../components/VehicleCard';
import { useVehicles } from '../context/VehiclesContext';
import { useLanguage } from '../context/LanguageContext';
import { DEALERSHIPS_DATA } from '../data/dealershipsData';

export const HomePage: React.FC = () => {
  const { approvedVehicles } = useVehicles();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Categories of cars
  const recommendedVehicles = approvedVehicles.filter((v) => v.is_recommended || v.is_premium).slice(0, 4);
  const newArrivals = [...approvedVehicles].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 4);
  const budgetVehicles = approvedVehicles.filter((v) => v.price_uzs <= 100000000).slice(0, 4);
  const mostViewedVehicles = [...approvedVehicles].sort((a, b) => b.views_count - a.views_count).slice(0, 4);

  return (
    <div className="bg-[#F4F7FB] min-h-screen">
      {/* 1. Hero Search Banner */}
      <SearchHero />

      {/* 2. Quick Categories & Popular Models */}
      <QuickCategories />

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* 3. Recommended & VIP Vehicles */}
        {recommendedVehicles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h2 className="text-2xl sm:text-3xl font-black text-[#102A43]">
                    {t('recommended_cars')}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {language === 'uz'
                    ? "Eng ko'p tavsiya etilgan va tekshirilgan premium e'lonlar"
                    : "Лучшие проверенные и премиальные объявления"}
                </p>
              </div>

              <Link
                to="/vehicles"
                className="text-xs sm:text-sm font-bold text-[#1769AA] hover:text-[#102A43] flex items-center gap-1 group"
              >
                <span>{t('all_cars')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </section>
        )}

        {/* 4. New Today / Latest Arrivals */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-emerald-600" />
                <h2 className="text-2xl sm:text-3xl font-black text-[#102A43]">
                  {t('new_arrivals')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {language === 'uz'
                  ? "Bugun va so'nggi 24 soat ichida qo'shilgan yangi mashinalar"
                  : "Свежие объявления, добавленные за последние 24 часа"}
              </p>
            </div>

            <Link
              to="/vehicles?sortBy=newest"
              className="text-xs sm:text-sm font-bold text-[#1769AA] hover:text-[#102A43] flex items-center gap-1 group"
            >
              <span>{t('all_cars')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>

        {/* 5. Mid-page High-Impact Banner: Sell your car fast */}
        <section className="bg-linear-to-r from-[#1769AA] to-[#102A43] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              Bepul va tezkor
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
              {language === 'uz'
                ? "Avtomobilingizni 3 kunda soting!"
                : "Продайте автомобиль за 3 дня!"}
            </h3>
            <p className="text-sm sm:text-base text-blue-100 mb-6 leading-relaxed">
              {language === 'uz'
                ? "Har kuni 50 000 dan ortiq xaridor AVTOBOZOR.UZ da mashina qidirmoqda. E'loningizni hoziroq bepul joylashtiring va xaridorlar bilan to'g'ridan-to'g'ri bog'laning."
                : "Ежедневно более 50 000 покупателей ищут автомобили на AVTOBOZOR.UZ. Разместите объявление бесплатно и общайтесь с покупателями напрямую."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/post-ad"
                className="px-7 py-3.5 rounded-xl bg-[#16A36A] hover:bg-[#138A59] text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all hover:scale-105"
              >
                + {t('hero_btn_post')}
              </Link>
              <Link
                to="/vehicles"
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md transition-all"
              >
                {t('hero_btn_search')}
              </Link>
            </div>
          </div>

          <div className="hidden lg:block absolute right-8 -bottom-10 opacity-30 pointer-events-none">
            <Car className="w-80 h-80 text-white" />
          </div>
        </section>

        {/* 6. Budget Cars Under 100,000,000 UZS */}
        {budgetVehicles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-2xl sm:text-3xl font-black text-[#102A43]">
                    {language === 'uz'
                      ? "100 000 000 so'mgacha bo'lgan arzon avtomobillar"
                      : "Доступные авто до 100 000 000 сум"}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {language === 'uz'
                    ? "Hamyonbop va ishonchli mahalliy avtomobillar katalogi"
                    : "Экономичные и надежные автомобили для любого бюджета"}
                </p>
              </div>

              <Link
                to="/vehicles?maxPrice=100000000"
                className="text-xs sm:text-sm font-bold text-[#1769AA] hover:text-[#102A43] flex items-center gap-1 group"
              >
                <span>{t('all_cars')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {budgetVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </section>
        )}

        {/* 7. Most Viewed Vehicles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#1769AA]" />
                <h2 className="text-2xl sm:text-3xl font-black text-[#102A43]">
                  {t('most_viewed')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {language === 'uz'
                  ? "Xaridorlar tomonidan eng ko'p ko'rilgan va qiziqish uyg'otgan mashinalar"
                  : "Самые популярные объявления по количеству просмотров"}
              </p>
            </div>

            <Link
              to="/vehicles?sortBy=popular"
              className="text-xs sm:text-sm font-bold text-[#1769AA] hover:text-[#102A43] flex items-center gap-1 group"
            >
              <span>{t('all_cars')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mostViewedVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </section>

        {/* 8. Authorized Dealerships Preview */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl sm:text-3xl font-black text-[#102A43]">
                  {t('nav_dealerships')}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {language === 'uz'
                  ? "O'zbekistondagi rasmiy avtosalonlar va dilerlik markazlari"
                  : "Официальные автосалоны и дилерские центры Узбекистана"}
              </p>
            </div>

            <Link
              to="/dealerships"
              className="text-xs sm:text-sm font-bold text-[#1769AA] hover:underline"
            >
              Barcha salonlar ({DEALERSHIPS_DATA.length}) →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DEALERSHIPS_DATA.slice(0, 3).map((dealership) => (
              <div
                key={dealership.id}
                onClick={() => navigate('/dealerships')}
                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 hover:border-[#1769AA] p-5 cursor-pointer transition-all hover:shadow-lg group"
              >
                <img
                  src={dealership.image_url}
                  alt={dealership.name}
                  className="w-full h-40 object-cover rounded-xl mb-4 group-hover:scale-102 transition-transform duration-300"
                />
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-base text-gray-900 group-hover:text-[#1769AA] transition-colors">
                    {dealership.name}
                  </h4>
                  {dealership.is_verified && (
                    <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" />
                      Diler
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-3">{dealership.region}, {dealership.address}</p>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-200 text-gray-600">
                  <span className="font-semibold text-emerald-700">{dealership.cars_count} ta avtomobil</span>
                  <span className="text-[#1769AA] font-bold">{dealership.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Why AVTOBOZOR.UZ Trust Grid */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-[#102A43] mb-3">
              {language === 'uz'
                ? "Nega aynan AVTOBOZOR.UZ?"
                : "Почему выбирают AVTOBOZOR.UZ?"}
            </h3>
            <p className="text-sm text-gray-500">
              {language === 'uz'
                ? "Biz O'zbekiston avtomobil ixlosmandlari uchun eng qulay, xavfsiz va shaffof muhitni yaratdik."
                : "Мы создали самую удобную, безопасную и прозрачную среду для автолюбителей Узбекистана."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              <div className="w-12 h-12 rounded-xl bg-[#1769AA] text-white flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <Wallet className="w-6 h-6" />
              </div>
              <h4 className="font-black text-lg text-[#102A43] mb-2">100% Faqat So'mda (UZS)</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Platformadagi barcha narxlar milliy valyutamizda ko'rsatiladi. Valyuta tebranishi va xatoliklar bo'lmaydi.
              </p>
            </div>

            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
              <div className="w-12 h-12 rounded-xl bg-[#16A36A] text-white flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-black text-lg text-[#102A43] mb-2">Faqat Mahalliy Modellar</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Chevrolet, Ravon va Daewoo modellari admin tomonidan qat'iy tasdiqlangan. Soxta va mavjud bo'lmagan e'lonlarga yo'l yo'q.
              </p>
            </div>

            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-black text-lg text-[#102A43] mb-2">Tezkor Bog'lanish</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Sotuvchi bilan bir zumda to'g'ridan-to'g'ri telefon yoki Telegram orqali vositachilarsiz bog'lanish imkoniyati.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
