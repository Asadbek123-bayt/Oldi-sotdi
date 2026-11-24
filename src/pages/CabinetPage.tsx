import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Car,
  Heart,
  Bookmark,
  Bell,
  Settings,
  ShieldCheck,
  CheckCircle,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Phone,
  Send,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehiclesContext';
import { useLanguage } from '../context/LanguageContext';
import { formatPriceUZS } from '../utils/formatters';
import { VehicleCard } from '../components/VehicleCard';

export const CabinetPage: React.FC = () => {
  const { user, isAuthenticated, openLoginModal, updateProfile } = useAuth();
  const {
    vehicles,
    favorites,
    savedSearches,
    removeSavedSearch,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    markAsSold,
    deleteVehicle,
  } = useVehicles();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'ads' | 'favorites' | 'searches' | 'notifications' | 'profile'>('ads');

  // Profile form state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '');
  const [telegram, setTelegram] = useState(user?.telegram_username || '');
  const [profileSaved, setProfileSaved] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] py-16 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-lg border border-gray-200">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#102A43] mb-2">{t('cabinet_title')}</h2>
          <p className="text-sm text-gray-500 mb-6">
            Shaxsiy kabinetga kirish uchun telefon raqamingiz orqali tizimga kiring.
          </p>
          <button
            onClick={openLoginModal}
            className="w-full py-3.5 rounded-xl bg-[#1769AA] text-white font-bold text-sm shadow-md"
          >
            {t('nav_login')}
          </button>
        </div>
      </div>
    );
  }

  // Filter vehicles belonging to this user (or demo listings)
  const myVehicles = vehicles.filter((v) => v.user_id === user.id || v.user_id === 'usr-101');
  const favoritedVehicles = vehicles.filter((v) => favorites.includes(v.id));

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      phone_number: phoneNumber,
      telegram_username: telegram,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user.full_name}
              className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-gray-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#102A43]">{user.full_name}</h1>
                {user.is_verified && (
                  <span title="Tasdiqlangan foydalanuvchi">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  </span>
                )}
                {user.role === 'admin' && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-black">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{user.phone_number} • {user.telegram_username || '@foydalanuvchi'}</p>
            </div>
          </div>

          <Link
            to="/post-ad"
            className="px-6 py-3 rounded-xl bg-[#16A36A] hover:bg-[#138A59] text-white font-bold text-sm shadow-md transition-all shrink-0"
          >
            + {t('nav_post_ad')}
          </Link>
        </div>

        {/* Layout: Sidebar Tabs + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-xs space-y-1">
              <button
                onClick={() => setActiveTab('ads')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === 'ads'
                    ? 'bg-blue-50 text-[#1769AA]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Car className="w-4 h-4" />
                  <span>{t('cabinet_my_ads')}</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{myVehicles.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('favorites')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === 'favorites'
                    ? 'bg-blue-50 text-[#1769AA]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>{t('nav_favorites')}</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{favorites.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('searches')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === 'searches'
                    ? 'bg-blue-50 text-[#1769AA]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Bookmark className="w-4 h-4 text-[#1769AA]" />
                  <span>{t('cabinet_saved_searches')}</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{savedSearches.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center justify-between p-3 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === 'notifications'
                    ? 'bg-blue-50 text-[#1769AA]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <span>{t('notifications')}</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{notifications.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-2.5 p-3 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-[#1769AA]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span>{t('cabinet_profile_settings')}</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            {/* TAB: My Ads */}
            {activeTab === 'ads' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-[#102A43]">{t('cabinet_my_ads')}</h3>
                  <Link
                    to="/post-ad"
                    className="text-xs font-bold text-[#1769AA] hover:underline"
                  >
                    + Yangi e'lon
                  </Link>
                </div>

                {myVehicles.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                    <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="font-bold text-base text-gray-700 mb-1">Sizda hali e'lonlar yo'q</h4>
                    <p className="text-xs text-gray-400 mb-4">Birinchi avtomobilingizni hoziroq soting</p>
                    <Link
                      to="/post-ad"
                      className="px-6 py-2.5 rounded-xl bg-[#16A36A] text-white font-bold text-xs inline-block"
                    >
                      E'lon berish
                    </Link>
                  </div>
                ) : (
                  myVehicles.map((car) => (
                    <div
                      key={car.id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
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
                              {car.status === 'approved' ? 'Faol' : car.status === 'sold' ? 'Sotildi' : 'Kutilmoqda'}
                            </span>
                          </div>
                          <p className="text-sm font-black text-[#1769AA] mt-0.5">
                            {formatPriceUZS(car.price_uzs, language)}
                          </p>
                          <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1">
                            <span>{car.region}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {car.views_count} ko'rildi
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {car.status !== 'sold' && (
                          <button
                            onClick={() => markAsSold(car.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors"
                          >
                            Sotildi deb belgilash
                          </button>
                        )}
                        <Link
                          to={`/vehicle/${car.id}`}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                          title="Ko'rish"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteVehicle(car.id)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Favorites */}
            {activeTab === 'favorites' && (
              <div>
                <h3 className="text-xl font-black text-[#102A43] mb-4">{t('nav_favorites')}</h3>
                {favoritedVehicles.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="font-bold text-base text-gray-700 mb-1">Sevimlilar ro'yxati bo'sh</h4>
                    <p className="text-xs text-gray-400 mb-4">Yoqqan mashinalarni yurakcha belgisi orqali saqlang</p>
                    <Link
                      to="/vehicles"
                      className="px-6 py-2.5 rounded-xl bg-[#1769AA] text-white font-bold text-xs inline-block"
                    >
                      Avtomobillar katalogi
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {favoritedVehicles.map((car) => (
                      <VehicleCard key={car.id} vehicle={car} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: Saved Searches */}
            {activeTab === 'searches' && (
              <div className="space-y-4">
                <h3 className="text-xl font-black text-[#102A43] mb-2">{t('cabinet_saved_searches')}</h3>

                {savedSearches.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                    <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="font-bold text-base text-gray-700 mb-1">Saqlangan qidiruvlar yo'q</h4>
                    <p className="text-xs text-gray-400">Filtr parametrlarini saqlab, yangi e'lonlarni tezkor kuzatib boring</p>
                  </div>
                ) : (
                  savedSearches.map((s) => (
                    <div
                      key={s.id}
                      className="bg-white rounded-2xl p-5 border border-gray-200 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-black text-sm text-[#102A43]">{s.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">
                          Saqlangan sana: {new Date(s.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/vehicles?brand=${s.filters.brand || ''}&model=${s.filters.model || ''}&region=${s.filters.region || ''}`}
                          className="px-4 py-2 rounded-xl bg-[#1769AA] text-white font-bold text-xs"
                        >
                          Qidiruvni ochish
                        </Link>
                        <button
                          onClick={() => removeSavedSearch(s.id)}
                          className="p-2 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-[#102A43]">{t('notifications')}</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Barchasini tozalash
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h4 className="font-bold text-base text-gray-700">Bildirishnomalar mavjud emas</h4>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.link) navigate(n.link);
                      }}
                      className={`p-5 rounded-2xl border transition-colors cursor-pointer ${
                        !n.is_read ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-black text-sm text-[#102A43]">{n.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                          <span className="text-[10px] text-gray-400 mt-2 block">
                            {new Date(n.created_at).toLocaleString()}
                          </span>
                        </div>
                        {!n.is_read && (
                          <span className="w-2.5 h-2.5 rounded-full bg-[#1769AA] shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Profile Settings */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
                <h3 className="text-xl font-black text-[#102A43] mb-6">Profil ma'lumotlarini tahrirlash</h3>

                <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      To'liq ism
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Telefon raqami
                    </label>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Telegram username
                    </label>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="@username"
                      className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                    />
                  </div>

                  {profileSaved && (
                    <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Ma'lumotlar saqlandi!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-xl bg-[#1769AA] hover:bg-[#102A43] text-white font-bold text-sm shadow-md transition-all"
                  >
                    Saqlash
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
