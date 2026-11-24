import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Car,
  Trash2,
  Users,
  Eye,
  ExternalLink,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehiclesContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPriceUZS } from '../utils/formatters';
import { APPROVED_BRANDS } from '../data/mockData';

export const AdminPage: React.FC = () => {
  const { user, isAdmin, switchPersona } = useAuth();
  const { vehicles, updateVehicleStatus, deleteVehicle, reports, updateReportStatus } = useVehicles();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'moderation' | 'all' | 'reports' | 'catalog'>('moderation');

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] py-16 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-gray-200">
          <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#102A43] mb-2">{t('admin_unauthorized')}</h2>
          <p className="text-sm text-gray-500 mb-6">
            Ushbu sahifa faqat platforma moderatorlari va administratorlari uchun mo'ljallangan.
          </p>
          <button
            onClick={() => switchPersona('admin')}
            className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md"
          >
            Admin sifatida kirish (Demo Rejim)
          </button>
        </div>
      </div>
    );
  }

  const pendingVehicles = vehicles.filter((v) => v.status === 'pending');
  const approvedVehicles = vehicles.filter((v) => v.status === 'approved');
  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Header */}
        <div className="bg-linear-to-r from-[#102A43] to-[#1769AA] rounded-3xl p-8 text-white shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400 text-gray-950 font-black text-xs px-2.5 py-0.5 rounded-md uppercase">
                Admin Panel
              </span>
              <span className="text-blue-200 text-xs">AVTOBOZOR.UZ Boshqaruv Markazi</span>
            </div>
            <h1 className="text-3xl font-black">{t('admin_title')}</h1>
            <p className="text-sm text-blue-100 mt-1">
              E'lonlar moderatsiyasi, foydalanuvchi shikoyatlari va katalog nazorati
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => switchPersona('user')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md"
            >
              Foydalanuvchi ko'rinishiga qaytish
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Jami e'lonlar
            </span>
            <span className="text-3xl font-black text-[#102A43] mt-1 block">
              {vehicles.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block">
              Kutilayotganlar
            </span>
            <span className="text-3xl font-black text-amber-600 mt-1 block">
              {pendingVehicles.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">
              Tasdiqlanganlar
            </span>
            <span className="text-3xl font-black text-emerald-600 mt-1 block">
              {approvedVehicles.length}
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider block">
              Shikoyatlar
            </span>
            <span className="text-3xl font-black text-red-600 mt-1 block">
              {pendingReports.length}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${
              activeTab === 'moderation'
                ? 'bg-[#1769AA] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {t('admin_tab_pending')} ({pendingVehicles.length})
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${
              activeTab === 'all'
                ? 'bg-[#1769AA] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {t('admin_tab_all')} ({vehicles.length})
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${
              activeTab === 'reports'
                ? 'bg-[#1769AA] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {t('admin_tab_reports')} ({pendingReports.length})
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-5 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${
              activeTab === 'catalog'
                ? 'bg-[#1769AA] text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Katalog (Marka / Model)
          </button>
        </div>

        {/* Tab 1: Moderation Queue */}
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            {pendingVehicles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-xl font-black text-[#102A43] mb-1">
                  Barcha e'lonlar moderatsiyadan o'tgan!
                </h3>
                <p className="text-xs text-gray-400">
                  Hozirda kutilayotgan yangi e'lonlar mavjud emas.
                </p>
              </div>
            ) : (
              pendingVehicles.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-2xl p-5 border border-amber-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <img
                      src={car.images[0]}
                      alt=""
                      className="w-28 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-black text-lg text-[#102A43]">
                        {car.brand_name} {car.model_name} {car.year}
                      </h4>
                      <p className="text-base font-black text-[#1769AA]">
                        {formatPriceUZS(car.price_uzs, language)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Sotuvchi: {car.contact_name} ({car.contact_phone}) • {car.region}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <Link
                      to={`/vehicle/${car.id}`}
                      className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700"
                      title="Ko'rish"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => updateVehicleStatus(car.id, 'rejected')}
                      className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{t('admin_reject')}</span>
                    </button>
                    <button
                      onClick={() => updateVehicleStatus(car.id, 'approved')}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{t('admin_approve')}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: All Vehicles */}
        {activeTab === 'all' && (
          <div className="space-y-4">
            {vehicles.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <img
                    src={car.images[0]}
                    alt=""
                    className="w-24 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/vehicle/${car.id}`}
                        className="font-black text-base text-[#102A43] hover:text-[#1769AA]"
                      >
                        {car.brand_name} {car.model_name} {car.year}
                      </Link>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          car.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : car.status === 'sold'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {car.status}
                      </span>
                    </div>
                    <p className="text-sm font-black text-[#1769AA]">
                      {formatPriceUZS(car.price_uzs, language)}
                    </p>
                    <p className="text-xs text-gray-500">{car.contact_name} • {car.region}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={() => updateVehicleStatus(car.id, car.status === 'approved' ? 'pending' : 'approved')}
                    className="px-3 py-1.5 rounded-lg border text-xs font-bold"
                  >
                    Holat: {car.status}
                  </button>
                  <Link
                    to={`/vehicle/${car.id}`}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteVehicle(car.id)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-xl font-black text-[#102A43]">Shikoyatlar mavjud emas</h3>
              </div>
            ) : (
              reports.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white rounded-2xl p-5 border border-red-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                      Sabab: {rep.reason}
                    </span>
                    <h4 className="font-black text-base text-[#102A43] mt-1">{rep.vehicle_title}</h4>
                    <p className="text-xs text-gray-600 mt-1">Izoh: {rep.details}</p>
                    {rep.reporter_phone && (
                      <p className="text-xs text-gray-400 mt-0.5">Xabar beruvchi: {rep.reporter_phone}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateReportStatus(rep.id, 'dismissed')}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
                    >
                      Rad etish
                    </button>
                    <button
                      onClick={() => {
                        updateReportStatus(rep.id, 'reviewed');
                        deleteVehicle(rep.vehicle_id);
                      }}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs"
                    >
                      E'lonni o'chirish
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Pre-approved Catalog */}
        {activeTab === 'catalog' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
            <h3 className="text-xl font-black text-[#102A43] mb-2">
              Mahalliy avtomobil katalogi (Faqat O'zbekiston)
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Katalogga yangi marka yoki modellar faqat admin tomonidan kiritilishi mumkin.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {APPROVED_BRANDS.map((b) => (
                <div key={b.name} className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                  <h4 className="font-black text-lg text-[#102A43] mb-3 pb-2 border-b border-gray-200">
                    {b.name}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {b.models.map((m) => (
                      <span
                        key={m}
                        className="px-2.5 py-1 rounded-lg bg-white text-xs font-bold text-gray-800 border border-gray-200 shadow-2xs"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
