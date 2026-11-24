import React, { useState } from 'react';
import { ShieldCheck, MapPin, Phone, Clock, Car, ExternalLink, Award, Search } from 'lucide-react';
import { DEALERSHIPS_DATA } from '../data/dealershipsData';
import { useLanguage } from '../context/LanguageContext';
import { UZBEKISTAN_REGIONS } from '../data/mockData';

export const DealershipsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDealerships = DEALERSHIPS_DATA.filter((dealer) => {
    if (selectedRegion && !dealer.region.toLowerCase().includes(selectedRegion.toLowerCase())) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        dealer.name.toLowerCase().includes(q) ||
        dealer.address.toLowerCase().includes(q) ||
        dealer.brands.some((b) => b.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="bg-linear-to-r from-[#102A43] to-[#1769AA] rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-10">
          <div className="max-w-2xl">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              Rasmiy Kafolat
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
              {t('nav_dealerships')}
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              {language === 'uz'
                ? "O'zbekistondagi rasmiy Chevrolet, Ravon va boshqa avtosalonlar. Yangi avtomobillar, lizing, trade-in va rasmiy kafolat bilan xarid qiling."
                : "Официальные автосалоны и дилерские центры в Узбекистане. Новые автомобили с официальной гарантией, лизингом и trade-in."}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Salon nomi yoki brend bo'yicha qidiruv..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 focus:border-[#1769AA] text-sm text-gray-800"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-gray-200 focus:border-[#1769AA] text-sm font-semibold text-gray-800 bg-white"
            >
              <option value="">Barcha hududlar</option>
              {UZBEKISTAN_REGIONS.map((r) => (
                <option key={r.id} value={r.name_uz}>
                  {language === 'uz' ? r.name_uz : r.name_ru}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dealerships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDealerships.map((dealership) => (
            <div
              key={dealership.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                <img
                  src={dealership.image_url}
                  alt={dealership.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Rasmiy Diler</span>
                </div>
                <div className="absolute bottom-3 right-3 bg-[#102A43]/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-lg font-bold">
                  {dealership.cars_count} ta avtomobil
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black text-[#102A43] mb-2">{dealership.name}</h3>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {dealership.brands.map((b) => (
                      <span
                        key={b}
                        className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1769AA] text-xs font-bold border border-blue-100"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2 text-xs text-gray-600 mb-6">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <span>{dealership.region}, {dealership.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{dealership.working_hours}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <a
                    href={`tel:${dealership.phone.replace(/\D/g, '')}`}
                    className="flex-1 h-11 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#16A36A] font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{dealership.phone}</span>
                  </a>

                  {dealership.telegram && (
                    <a
                      href={`https://t.me/${dealership.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="h-11 px-4 rounded-xl bg-[#229ED9] hover:bg-[#1E8BC0] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <span>Telegram</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
