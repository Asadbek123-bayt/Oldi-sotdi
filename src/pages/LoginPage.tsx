import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import {
  Car,
  Phone,
  KeyRound,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const { loginWithPhone, switchPersona, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/cabinet';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl);
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 12) {
      setError(
        language === 'uz'
          ? "Telefon raqamini to'liq kiriting"
          : "Введите полный номер телефона"
      );
      return;
    }
    if (mode === 'register' && !fullName.trim()) {
      setError(
        language === 'uz'
          ? "Iltimos, ismingizni kiriting"
          : "Пожалуйста, введите ваше имя"
      );
      return;
    }
    setError('');
    setStep('code');
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const success = await loginWithPhone(phone, code);
    setIsLoading(false);
    if (!success) {
      setError(
        language === 'uz'
          ? "Tasdiqlash kodi noto'g'ri (Demo: 7777)"
          : "Неверный код (Демо: 7777)"
      );
    } else {
      navigate(redirectUrl);
    }
  };

  return (
    <div className="bg-[#F4F7FB] min-h-[calc(100vh-80px)] py-12 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Card Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#1769AA] to-[#102A43] flex items-center justify-center text-white shadow-lg">
              <Car className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-[#102A43]">
              AVTOBOZOR<span className="text-[#16A36A]">.UZ</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-[#102A43]">
            {mode === 'login' ? t('login_modal_title') : "Ro'yxatdan o'tish"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {mode === 'login'
              ? (language === 'uz' ? "Avtomobilingizni boshqarish va xarid qilish uchun kiring" : "Войдите для управления объявлениями и покупками")
              : (language === 'uz' ? "Yangi hisob yaratib, bepul e'lon joylang" : "Создайте аккаунт и подавайте объявления бесплатно")}
          </p>
        </div>

        {/* Main Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xl">
          {/* Tabs */}
          <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6">
            <button
              onClick={() => {
                setMode('login');
                setStep('phone');
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#102A43] shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t('nav_login')}
            </button>
            <button
              onClick={() => {
                setMode('register');
                setStep('phone');
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                mode === 'register'
                  ? 'bg-white text-[#102A43] shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Ro'yxatdan o'tish
            </button>
          </div>

          {/* Form */}
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    To'liq ismingiz
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Masalan: Sardor Rahimov"
                      className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#1769AA] focus:ring-2 focus:ring-blue-100 font-semibold text-sm text-gray-900"
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-4" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  {t('login_modal_phone')}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:border-[#1769AA] focus:ring-2 focus:ring-blue-100 font-semibold text-base text-gray-900"
                    autoFocus
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-4" />
                </div>
              </div>

              {error && (
                <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#1769AA] hover:bg-[#102A43] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'uz' ? "SMS kodni olish" : "Получить SMS код"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5 text-center">
                  SMS orqali kelgan 4 xonali kod (Demo: <strong className="text-[#1769AA]">7777</strong>)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={4}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="7777"
                    className="w-full h-14 px-4 rounded-xl border-2 border-[#1769AA] focus:ring-2 focus:ring-blue-100 font-black text-center text-2xl tracking-widest text-gray-900"
                    autoFocus
                  />
                  <KeyRound className="w-5 h-5 text-gray-400 absolute left-4 top-4.5" />
                </div>
              </div>

              {error && (
                <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 text-center">
                  {error}
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="w-1/3 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
                >
                  Ortga
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-12 rounded-xl bg-[#16A36A] hover:bg-[#138A59] text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {t('login_modal_submit')}
                </button>
              </div>
            </form>
          )}

          {/* 1-Click Fast Demo Login Selector */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center mb-3">
              1-Klik Sinov (Tezkor Kirish)
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  switchPersona('user');
                  navigate(redirectUrl);
                }}
                className="p-3.5 rounded-2xl bg-blue-50/70 hover:bg-blue-100 border border-blue-200/60 text-left transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck className="w-4 h-4 text-[#1769AA]" />
                  <span className="text-xs font-bold text-[#102A43]">Jasur Boboyev</span>
                </div>
                <p className="text-[10px] text-gray-500">Oddiy foydalanuvchi</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  switchPersona('admin');
                  navigate('/admin');
                }}
                className="p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100 border border-amber-200/60 text-left transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-amber-900">Admin Panel</span>
                </div>
                <p className="text-[10px] text-gray-500">Boshqaruv markazi</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
