import React, { useState } from 'react';
import { X, Phone, KeyRound, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, loginWithPhone, switchPersona } = useAuth();
  const { t, language } = useLanguage();

  const [phone, setPhone] = useState('+998 ');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 12) {
      setError(language === 'uz' ? "Telefon raqamini to'liq kiriting" : "Введите полный номер телефона");
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
      setError(language === 'uz' ? "Tasdiqlash kodi noto'g'ri (Demo: 7777)" : "Неверный код (Демо: 7777)");
    } else {
      closeLoginModal();
      setStep('phone');
      setCode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative border border-gray-100">
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1769AA] mx-auto flex items-center justify-center mb-3">
            {step === 'phone' ? <Phone className="w-7 h-7" /> : <KeyRound className="w-7 h-7" />}
          </div>
          <h3 className="text-2xl font-black text-[#102A43]">
            {t('login_modal_title')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {step === 'phone'
              ? (language === 'uz' ? "Kirish uchun telefon raqamingizni kiriting" : "Введите номер телефона для входа")
              : (language === 'uz' ? "Telefoningizga yuborilgan 4 xonali kodni kiriting" : "Введите 4-значный код из SMS")}
          </p>
        </div>

        {/* Forms */}
        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                {t('login_modal_phone')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#1769AA] focus:ring-2 focus:ring-blue-100 font-semibold text-base text-gray-900"
                autoFocus
              />
            </div>

            {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#1769AA] hover:bg-[#102A43] text-white font-bold text-sm shadow-md transition-all"
            >
              {language === 'uz' ? "SMS kodni olish" : "Получить SMS код"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                {t('login_modal_code')} (Demo: <strong className="text-[#1769AA]">7777</strong>)
              </label>
              <input
                type="text"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="7777"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#1769AA] focus:ring-2 focus:ring-blue-100 font-black text-center text-xl tracking-widest text-gray-900"
                autoFocus
              />
            </div>

            {error && <p className="text-xs font-semibold text-red-600">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-1/3 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all"
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

        {/* Demo Fast Logins Section */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center mb-3">
            Tezkor sinov (Demo 1-Click Kirish)
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                switchPersona('user');
                closeLoginModal();
              }}
              className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200/60 text-left transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <UserCheck className="w-4 h-4 text-[#1769AA]" />
                <span className="text-xs font-bold text-[#102A43]">Foydalanuvchi</span>
              </div>
              <p className="text-[10px] text-gray-500">Jasur Boboyev</p>
            </button>

            <button
              onClick={() => {
                switchPersona('admin');
                closeLoginModal();
              }}
              className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/60 text-left transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-900">Admin Panel</span>
              </div>
              <p className="text-[10px] text-gray-500">Moderator / Boshqaruv</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
