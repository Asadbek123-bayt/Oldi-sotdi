import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useVehicles } from '../context/VehiclesContext';
import { useLanguage } from '../context/LanguageContext';
import { VehicleCard } from '../components/VehicleCard';

export const FavoritesPage: React.FC = () => {
  const { vehicles, favorites } = useVehicles();
  const { t } = useLanguage();

  const favoritedVehicles = vehicles.filter((v) => favorites.includes(v.id));

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#102A43] flex items-center gap-2">
              <Heart className="w-7 h-7 text-red-500 fill-current" />
              <span>{t('nav_favorites')}</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Siz saqlagan {favoritedVehicles.length} ta avtomobil
            </p>
          </div>

          <Link
            to="/vehicles"
            className="text-xs sm:text-sm font-bold text-[#1769AA] hover:underline flex items-center gap-1"
          >
            <span>Katalogga o'tish</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {favoritedVehicles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-lg mx-auto shadow-xs">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-black text-[#102A43] mb-2">{t('favorites_empty')}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Siz hali hech qanday mashinani sevimlilarga qo'shmadingiz. Yoqqan e'lonlarni saqlab qo'yish uchun yurakcha belgisini bosing.
            </p>
            <Link
              to="/vehicles"
              className="px-8 py-3 rounded-xl bg-[#1769AA] text-white font-bold text-sm shadow-md inline-block"
            >
              {t('nav_cars')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritedVehicles.map((car) => (
              <VehicleCard key={car.id} vehicle={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
