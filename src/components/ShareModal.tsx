import React, { useState } from 'react';
import { X, Send, Share2, Copy, Check, MessageSquare } from 'lucide-react';
import { Vehicle } from '../types';

interface ShareModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ vehicle, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = window.location.href;
  const shareText = `${vehicle.brand_name} ${vehicle.model_name} ${vehicle.year} — AVTOBOZOR.UZ da ko'ring: ${shareUrl}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1769AA] mx-auto flex items-center justify-center mb-2">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-[#102A43]">Ulashish</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{vehicle.brand_name} {vehicle.model_name} {vehicle.year}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={shareTelegram}
            className="w-full flex items-center justify-center gap-3 p-3.5 rounded-xl bg-[#229ED9] hover:bg-[#1E8BC0] text-white font-bold text-sm shadow-md transition-all"
          >
            <Send className="w-5 h-5" />
            <span>Telegram orqali ulashish</span>
          </button>

          <button
            onClick={shareWhatsApp}
            className="w-full flex items-center justify-center gap-3 p-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm shadow-md transition-all"
          >
            <MessageSquare className="w-5 h-5" />
            <span>WhatsApp orqali ulashish</span>
          </button>

          <div className="pt-2">
            <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-xl border border-gray-200">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="bg-transparent text-xs text-gray-600 truncate flex-1 outline-hidden font-mono px-2"
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-[#1769AA] font-bold text-xs shadow-xs flex items-center gap-1 border border-gray-200 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Nusxalandi!" : "Nusxa olish"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
