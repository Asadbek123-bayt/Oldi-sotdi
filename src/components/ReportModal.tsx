import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useVehicles } from '../context/VehiclesContext';
import { Vehicle } from '../types';

interface ReportModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ vehicle, isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { addReport } = useVehicles();

  const [reason, setReason] = useState('wrong_price');
  const [details, setDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    { id: 'wrong_price', label: t('report_reason_price') },
    { id: 'already_sold', label: t('report_reason_sold') },
    { id: 'fraud', label: t('report_reason_fraud') },
    { id: 'wrong_info', label: t('report_reason_wrong_info') },
    { id: 'other', label: t('report_reason_other') },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReport({
      vehicle_id: vehicle.id,
      vehicle_title: `${vehicle.brand_name} ${vehicle.model_name} ${vehicle.year}`,
      reporter_phone: phone || undefined,
      reason,
      details,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-xl font-black text-[#102A43] mb-2">{t('report_success')}</h3>
            <p className="text-sm text-gray-500">Moderatorlarimiz e'lonni tez orada tekshirib chiqishadi.</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#102A43]">{t('report_modal_title')}</h3>
                <p className="text-xs text-gray-500 line-clamp-1">{vehicle.brand_name} {vehicle.model_name} {vehicle.year}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Sababni tanlang
                </label>
                <div className="space-y-2">
                  {reasons.map((r) => (
                    <label
                      key={r.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-semibold cursor-pointer transition-all ${
                        reason === r.id
                          ? 'border-red-500 bg-red-50/50 text-red-900'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        checked={reason === r.id}
                        onChange={() => setReason(r.id)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Qo'shimcha izoh
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Batafsil ma'lumot..."
                  className="w-full p-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Telefon raqamingiz (ixtiyoriy)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full h-11 px-3 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 text-sm text-gray-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 h-11 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  {t('report_submit')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
