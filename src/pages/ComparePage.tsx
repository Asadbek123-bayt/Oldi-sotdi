import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Trash2, ArrowRight, Check, X, PlusCircle } from 'lucide-react';
import { useVehicles } from '../context/VehiclesContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPriceUZS, formatMileage } from '../utils/formatters';

export const ComparePage: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useVehicles();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] py-16 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center border border-gray-200 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1769AA] mx-auto flex items-center justify-center mb-4">
            <Scale className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-[#102A43] mb-2">{t('compare_empty')}</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Avtomobillarni texnik xususiyatlari va narxlari bo'yicha yonma-yon taqqoslash uchun katalogdan avtomobil kartochkasidagi tarozi belgisini bosing (4 tagacha).
          </p>
          <Link
            to="/vehicles"
            className="px-8 py-3.5 rounded-xl bg-[#1769AA] hover:bg-[#102A43] text-white font-bold text-sm shadow-md inline-block"
          >
            {t('nav_cars')}
          </Link>
        </div>
      </div>
    );
  }

  const specRows = [
    { label: "Narxi (UZS)", getVal: (car: any) => formatPriceUZS(car.price_uzs, language), highlight: true },
    { label: "Ishlab chiqarilgan yili", getVal: (car: any) => car.year },
    { label: "Yurgan masofasi", getVal: (car: any) => formatMileage(car.mileage) },
    { label: "Yoqilg'i turi", getVal: (car: any) => t(`fuel_${car.fuel_type}`) },
    { label: "Uzatmalar qutisi", getVal: (car: any) => t(`trans_${car.transmission}`) },
    { label: "Kuzov turi", getVal: (car: any) => t(`body_${car.body_type}`) },
    { label: "Dvigatel hajmi", getVal: (car: any) => `${car.engine_volume} L` },
    { label: "Rangi", getVal: (car: any) => car.color },
    { label: "Hudud", getVal: (car: any) => car.region },
    { label: "Kelishiladi", getVal: (car: any) => car.is_negotiable ? "Ha" : "Yo'q" },
  ];

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#102A43] flex items-center gap-2">
              <Scale className="w-7 h-7 text-[#1769AA]" />
              <span>{t('compare_title')}</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {compareList.length} / 4 ta avtomobil taqqoslanmoqda
            </p>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length < 4 && (
              <button
                onClick={() => navigate('/vehicles')}
                className="px-4 py-2.5 rounded-xl bg-white text-[#1769AA] font-bold text-xs sm:text-sm border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Yana qo'shish</span>
              </button>
            )}

            <button
              onClick={clearCompare}
              className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs sm:text-sm hover:bg-red-100 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Tozalash</span>
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-4 sm:p-6 w-48 text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50/50">
                  Xususiyat
                </th>
                {compareList.map((car) => (
                  <th key={car.id} className="p-4 sm:p-6 min-w-56 align-top">
                    <div className="space-y-3">
                      <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-gray-100">
                        <img src={car.images[0]} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeFromCompare(car.id)}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:scale-105"
                          title="Olib tashlash"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <Link
                          to={`/vehicle/${car.id}`}
                          className="font-black text-sm text-gray-900 hover:text-[#1769AA] line-clamp-1 block"
                        >
                          {car.brand_name} {car.model_name} {car.year}
                        </Link>
                        <p className="text-base font-black text-[#102A43] mt-0.5">
                          {formatPriceUZS(car.price_uzs, language)}
                        </p>
                      </div>

                      <Link
                        to={`/vehicle/${car.id}`}
                        className="w-full py-2 rounded-xl bg-blue-50 hover:bg-[#1769AA] text-[#1769AA] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <span>E'lonni ochish</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {specRows.map((row, idx) => (
                <tr key={idx} className={row.highlight ? "bg-blue-50/30" : ""}>
                  <td className="p-4 sm:p-6 font-bold text-xs uppercase tracking-wider text-gray-500 bg-gray-50/50">
                    {row.label}
                  </td>
                  {compareList.map((car) => (
                    <td key={car.id} className="p-4 sm:p-6 font-semibold text-gray-800">
                      {row.highlight ? (
                        <span className="font-black text-base text-[#102A43]">
                          {row.getVal(car)}
                        </span>
                      ) : (
                        row.getVal(car)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
