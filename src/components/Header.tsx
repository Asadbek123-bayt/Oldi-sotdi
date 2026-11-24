import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Car,
  PlusCircle,
  Heart,
  Scale,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Bell,
  CheckCircle,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehiclesContext';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, isAdmin, logout, openLoginModal, switchPersona } = useAuth();
  const { favorites, compareList, notifications, markNotificationAsRead } = useVehicles();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.is_read);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#1769AA] to-[#102A43] flex items-center justify-center text-white shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform duration-200">
              <Car className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-[#102A43] group-hover:text-[#1769AA] transition-colors leading-none">
                AVTOBOZOR<span className="text-[#16A36A]">.UZ</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-1">
                {language === 'uz' ? "Avtomobil Bozori" : "Авторынок Узбекистана"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/')
                  ? 'text-[#1769AA] bg-blue-50/80'
                  : 'text-gray-700 hover:text-[#1769AA] hover:bg-gray-50'
              }`}
            >
              {t('nav_home')}
            </Link>

            <Link
              to="/vehicles"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/vehicles')
                  ? 'text-[#1769AA] bg-blue-50/80'
                  : 'text-gray-700 hover:text-[#1769AA] hover:bg-gray-50'
              }`}
            >
              {t('nav_cars')}
            </Link>

            <Link
              to="/dealerships"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/dealerships')
                  ? 'text-[#1769AA] bg-blue-50/80'
                  : 'text-gray-700 hover:text-[#1769AA] hover:bg-gray-50'
              }`}
            >
              {t('nav_dealerships')}
            </Link>

            <Link
              to="/favorites"
              className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/favorites')
                  ? 'text-[#1769AA] bg-blue-50/80'
                  : 'text-gray-700 hover:text-[#1769AA] hover:bg-gray-50'
              }`}
            >
              <Heart className="w-4 h-4 text-red-500" />
              <span>{t('nav_favorites')}</span>
              {favorites.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              to="/compare"
              className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/compare')
                  ? 'text-[#1769AA] bg-blue-50/80'
                  : 'text-gray-700 hover:text-[#1769AA] hover:bg-gray-50'
              }`}
            >
              <Scale className="w-4 h-4 text-[#1769AA]" />
              <span>{t('nav_compare')}</span>
              {compareList.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-blue-100 text-[#1769AA] rounded-full">
                  {compareList.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Right Actions: Language, Notification, Post Ad, Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => setLanguage('uz')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  language === 'uz'
                    ? 'bg-white text-[#102A43] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                UZ
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  language === 'ru'
                    ? 'bg-white text-[#102A43] shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                RU
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-gray-600 hover:text-[#1769AA] hover:bg-gray-100 rounded-lg transition-colors"
                title="Bildirishnomalar"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Notification Dropdown */}
              {notifDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setNotifDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-[#102A43]">{t('notifications')}</span>
                    <span className="text-xs text-gray-500">{unreadNotifs.length} {t('status_pending')}</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-400">
                        {t('no_vehicles_found')}
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.link) {
                              navigate(notif.link);
                              setNotifDropdownOpen(false);
                            }
                          }}
                          className={`p-3.5 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notif.is_read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#1769AA] mt-1.5 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-gray-800">{notif.title}</p>
                              <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notif.message}</p>
                              <span className="text-[10px] text-gray-400 mt-1 block">
                                {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Post Ad Button (Prominent Green CTA) */}
            <Link
              to="/post-ad"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#16A36A] hover:bg-[#138A59] text-white font-bold text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('nav_post_ad')}</span>
            </Link>

            {/* Auth Button or User Menu */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="text-left hidden xl:block pr-1">
                    <p className="text-xs font-bold text-gray-800 leading-tight flex items-center gap-1">
                      {user.full_name}
                      {isAdmin && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-black">
                          ADMIN
                        </span>
                      )}
                    </p>
                    <span className="text-[11px] text-gray-400">{user.phone_number}</span>
                  </div>
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-bold text-sm text-[#102A43]">{user.full_name}</p>
                      <p className="text-xs text-gray-500">{user.phone_number}</p>
                    </div>

                    <Link
                      to="/cabinet"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#1769AA]"
                    >
                      <User className="w-4 h-4" />
                      <span>{t('cabinet_title')}</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-amber-700 bg-amber-50/50 hover:bg-amber-50 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                        <span>{t('admin_title')}</span>
                      </Link>
                    )}

                    {/* Quick Demo Persona Switcher */}
                    <div className="px-4 py-2 mt-1 border-t border-gray-100 bg-gray-50/50">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                        Demo rejimida almashtirish
                      </p>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            switchPersona('user');
                            setUserDropdownOpen(false);
                          }}
                          className={`text-xs px-2 py-1 rounded font-semibold transition-all ${
                            !isAdmin ? 'bg-[#1769AA] text-white' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          Jasur (User)
                        </button>
                        <button
                          onClick={() => {
                            switchPersona('admin');
                            setUserDropdownOpen(false);
                          }}
                          className={`text-xs px-2 py-1 rounded font-semibold transition-all ${
                            isAdmin ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav_logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold text-[#102A43] hover:text-[#1769AA] hover:bg-blue-50/50 border border-gray-200 transition-all"
              >
                <User className="w-4 h-4" />
                <span>{t('nav_login')}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/post-ad"
              className="p-2 rounded-lg bg-[#16A36A] text-white font-bold"
              title={t('nav_post_ad')}
            >
              <PlusCircle className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Til / Язык:</span>
              <button
                onClick={() => setLanguage('uz')}
                className={`px-3 py-1 text-xs font-bold rounded-md ${
                  language === 'uz' ? 'bg-[#1769AA] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                UZ
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={`px-3 py-1 text-xs font-bold rounded-md ${
                  language === 'ru' ? 'bg-[#1769AA] text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                RU
              </button>
            </div>

            {isAuthenticated ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {user?.full_name}
              </span>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal();
                }}
                className="text-xs font-bold text-[#1769AA]"
              >
                {t('nav_login')}
              </button>
            )}
          </div>

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-800 hover:bg-gray-100"
            >
              {t('nav_home')}
            </Link>
            <Link
              to="/vehicles"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-800 hover:bg-gray-100"
            >
              {t('nav_cars')}
            </Link>
            <Link
              to="/dealerships"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-gray-800 hover:bg-gray-100"
            >
              {t('nav_dealerships')}
            </Link>
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-semibold text-gray-800 hover:bg-gray-100"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                {t('nav_favorites')}
              </span>
              {favorites.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-semibold text-gray-800 hover:bg-gray-100"
            >
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#1769AA]" />
                {t('nav_compare')}
              </span>
              {compareList.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-[#1769AA] rounded-full">
                  {compareList.length}
                </span>
              )}
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/cabinet"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-semibold text-[#1769AA] hover:bg-blue-50"
                >
                  {t('cabinet_title')}
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-semibold text-amber-700 bg-amber-50"
                  >
                    {t('admin_title')}
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="pt-2">
            <Link
              to="/post-ad"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#16A36A] text-white font-bold text-center"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{t('nav_post_ad')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
