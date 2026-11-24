import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, ShieldCheck, MapPin, Gauge, Fuel, Cog, Eye } from 'lucide-react';
import { Vehicle } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useVehicles } from '../context/VehiclesContext';
import { formatPriceUZS, formatMileage, formatListingDate } from '../utils/formatters';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const { t, language } = useLanguage();
  const { isFavorite, toggleFavorite, isInCompare, addToCompare, removeFromCompare } = useVehicles();

  const favoriteActive = isFavorite(vehicle.id);
  const compareActive = isInCompare(vehicle.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(vehicle.id);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (compareActive) {
      removeFromCompare(vehicle.id);
    } else {
      addToCompare(vehicle);
    }
  };

  const title = `${vehicle.brand_name} ${vehicle.model_name} ${vehicle.year}`;
  const isSold = vehicle.status === 'sold';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200/80 hover:border-[#1769AA]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image Thumbnail Container */}
      <Link to={`/vehicle/${vehicle.id}`} className="relative aspect-16/10 overflow-hidden bg-gray-100 block">
        <img
          src={vehicle.images[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {isSold ? (
            <span className="px-2.5 py-1 text-[11px] font-black uppercase rounded-lg bg-red-600 text-white shadow-md">
              {t('badge_sold')}
            </span>
          ) : (
            <>
              {vehicle.is_premium && (
                <span className="px-2.5 py-1 text-[11px] font-black uppercase rounded-lg bg-amber-500 text-white shadow-md">
                  VIP
                </span>
              )}
              {vehicle.is_recommended && (
                <span className="px-2.5 py-1 text-[11px] font-black uppercase rounded-lg bg-[#1769AA] text-white shadow-md">
                  {t('badge_recommended')}
                </span>
              )}
              {vehicle.year >= 2024 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-emerald-600 text-white shadow-md">
                  {t('badge_new')}
                </span>
              )}
            </>
          )}
        </div>

        {/* Action Buttons on Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          <button
            onClick={handleCompareClick}
            className={`w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
              compareActive
                ? 'bg-[#1769AA] text-white'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:text-[#1769AA]'
            }`}
            title={compareActive ? "Taqqoslashdan olib tashlash" : "Taqqoslashga qo'shish"}
          >
            <Scale className="w-4 h-4" />
          </button>

          <button
            onClick={handleFavoriteClick}
            className={`w-9 h-9 rounded-xl flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
              favoriteActive
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:text-red-500'
            }`}
            title={favoriteActive ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
          >
            <Heart className={`w-4 h-4 ${favoriteActive ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Photo count indicator */}
        <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1 pointer-events-none">
          <span>📷 {vehicle.images.length}</span>
        </div>
      </Link>

      {/* Details Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price — Strictly in UZS */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <span className="text-xl sm:text-2xl font-black text-[#102A43] tracking-tight">
              {formatPriceUZS(vehicle.price_uzs, language)}
            </span>
            {vehicle.is_negotiable && (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {t('negotiable')}
              </span>
            )}
          </div>

          {/* Car Title */}
          <Link
            to={`/vehicle/${vehicle.id}`}
            className="block text-base font-bold text-gray-900 group-hover:text-[#1769AA] transition-colors line-clamp-1 mb-3"
          >
            {title}
          </Link>

          {/* Technical Specs Pills */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{formatMileage(vehicle.mileage)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{t(`fuel_${vehicle.fuel_type}`)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Cog className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{t(`trans_${vehicle.transmission}`)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full border border-gray-300 inline-block shrink-0" style={{ backgroundColor: vehicle.color_hex || '#ccc' }} />
              <span className="truncate">{vehicle.color}</span>
            </div>
          </div>
        </div>

        {/* Bottom meta: Region & Date */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1 truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
            <span className="truncate text-gray-500 font-medium">{vehicle.region}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {vehicle.is_verified_seller && (
              <span title="Tekshirilgan sotuvchi" className="inline-flex items-center text-blue-600">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
            <span>{formatListingDate(vehicle.created_at, language)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
