import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Car,
  Image as ImageIcon,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { useVehicles } from '../context/VehiclesContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { APPROVED_BRANDS, UZBEKISTAN_REGIONS, COMMON_FEATURES } from '../data/mockData';
import { FuelType, TransmissionType, BodyType, Vehicle } from '../types';
import { formatPriceUZS } from '../utils/formatters';

export const PostAdPage: React.FC = () => {
  const navigate = useNavigate();
  const { addVehicle } = useVehicles();
  const { user, isAuthenticated, openLoginModal } = useAuth();
  const { t, language } = useLanguage();

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [brand, setBrand] = useState('Chevrolet');
  const [model, setModel] = useState('Cobalt');
  const [year, setYear] = useState<number>(2024);
  const [mileage, setMileage] = useState<number>(25000);
  const [fuelType, setFuelType] = useState<FuelType>('benzin');
  const [transmission, setTransmission] = useState<TransmissionType>('avtomat');
  const [bodyType, setBodyType] = useState<BodyType>('sedan');
  const [engineVolume, setEngineVolume] = useState<number>(1.5);
  const [color, setColor] = useState('Oq');
  const [features, setFeatures] = useState<string[]>(['Konditsioner', 'ABS']);

  // Images state (URLs)
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Price & Contacts
  const [priceUzs, setPriceUzs] = useState<number>(135000000);
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [region, setRegion] = useState('Toshkent shahri');
  const [city, setCity] = useState('Yunusobod');
  const [contactPhone, setContactPhone] = useState(user?.phone_number || '+998 90 123 45 67');
  const [contactName, setContactName] = useState(user?.full_name || 'Jasur Boboyev');
  const [contactTelegram, setContactTelegram] = useState(user?.telegram_username || '@jasur_avto');
  const [description, setDescription] = useState(
    'Mashina ideal holatda, kraskasi toza. Xarajati yo\'q, yangi balonlar qo\'yilgan. Faqat naqdga yoki kelishiladi.'
  );

  const [submittedVehicle, setSubmittedVehicle] = useState<Vehicle | null>(null);

  // Available models based on chosen brand
  const activeBrandObj = APPROVED_BRANDS.find((b) => b.name === brand);
  const availableModels = activeBrandObj ? activeBrandObj.models : [];

  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand);
    const bObj = APPROVED_BRANDS.find((b) => b.name === newBrand);
    if (bObj && bObj.models.length > 0) {
      setModel(bObj.models[0]);
    }
  };

  const handleToggleFeature = (feat: string) => {
    setFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim() && images.length < 10) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    const selected = images[index];
    const rest = images.filter((_, i) => i !== index);
    setImages([selected, ...rest]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const created = addVehicle({
      user_id: user?.id || 'usr-guest',
      brand_name: brand,
      model_name: model,
      year: Number(year),
      mileage: Number(mileage),
      fuel_type: fuelType,
      transmission,
      body_type: bodyType,
      engine_volume: Number(engineVolume),
      color,
      price_uzs: Number(priceUzs),
      is_negotiable: isNegotiable,
      region,
      city,
      description,
      features,
      status: 'approved', // Auto approved in demo
      is_premium: false,
      is_recommended: true,
      is_verified_seller: true,
      contact_phone: contactPhone,
      contact_telegram: contactTelegram,
      contact_name: contactName,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'],
    });

    setSubmittedVehicle(created);
    setCurrentStep(5);
  };

  const years = Array.from({ length: 30 }, (_, i) => 2025 - i);

  return (
    <div className="bg-[#F4F7FB] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wizard Steps Progress */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1769AA] z-0 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />

            {[
              { num: 1, label: "Marka & Model" },
              { num: 2, label: "Xarakteristikalar" },
              { num: 3, label: "Rasmlar" },
              { num: 4, label: "Narx & Aloqa" },
              { num: 5, label: "Tasdiqlash" },
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    currentStep === s.num
                      ? 'bg-[#1769AA] text-white ring-4 ring-blue-100'
                      : currentStep > s.num
                      ? 'bg-[#16A36A] text-white'
                      : 'bg-white text-gray-400 border border-gray-200'
                  }`}
                >
                  {currentStep > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                </div>
                <span className="text-[11px] font-bold text-gray-600 mt-2 hidden sm:block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-md">
          {/* STEP 1: Brand & Model Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#102A43]">
                  1-qadam: Avtomobil markasi va modelini tanlang
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Platformamizda faqat O'zbekiston bozorida tasdiqlangan modellar joylashtiriladi.
                </p>
              </div>

              {/* Brand Buttons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Ishlab chiqaruvchi (Marka)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {APPROVED_BRANDS.map((b) => (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => handleBrandChange(b.name)}
                      className={`h-14 rounded-2xl border-2 font-black text-base transition-all ${
                        brand === b.name
                          ? 'border-[#1769AA] bg-blue-50/60 text-[#1769AA] shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Model
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {availableModels.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModel(m)}
                      className={`p-3 rounded-xl border font-bold text-sm transition-all ${
                        model === m
                          ? 'border-[#1769AA] bg-[#1769AA] text-white shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3.5 rounded-xl bg-[#1769AA] hover:bg-[#102A43] text-white font-bold text-sm flex items-center gap-2 shadow-md"
                >
                  <span>Davom etish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Technical Specifications */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#102A43]">
                  2-qadam: Texnik xarakteristikalar
                </h2>
                <p className="text-xs text-gray-500 mt-1">{brand} {model} xususiyatlarini kiriting</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Year */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Ishlab chiqarilgan yili
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                  >
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* Mileage */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Yurgan masofasi (km)
                  </label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                  />
                </div>

                {/* Fuel */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Yoqilg'i turi
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                  >
                    <option value="benzin">Benzin</option>
                    <option value="gaz_metan">Gaz (Metan)</option>
                    <option value="gaz_propan">Gaz (Propan)</option>
                    <option value="gibrid">Gibrid</option>
                    <option value="elektr">Elektr</option>
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Uzatmalar qutisi
                  </label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as any)}
                    className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                  >
                    <option value="mexanika">Mexanika</option>
                    <option value="avtomat">Avtomat</option>
                  </select>
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Kuzov turi
                  </label>
                  <select
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value as any)}
                    className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="universal">Universal</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="suv">Krossover / SUV</option>
                    <option value="miniven">Miniven</option>
                    <option value="tijorat">Tijorat</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Rangi
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Oq, Qora, Mokriy asfalt..."
                    className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                  />
                </div>
              </div>

              {/* Features & Options Checkboxes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                  Qulayliklar va jihozlar
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_FEATURES.map((feat) => (
                    <label
                      key={feat}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        features.includes(feat)
                          ? 'border-[#1769AA] bg-blue-50 text-[#1769AA]'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={features.includes(feat)}
                        onChange={() => handleToggleFeature(feat)}
                        className="rounded text-[#1769AA] focus:ring-[#1769AA]"
                      />
                      <span>{feat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ortga</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3 rounded-xl bg-[#1769AA] hover:bg-[#102A43] text-white font-bold text-sm flex items-center gap-2 shadow-md"
                >
                  <span>Davom etish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Photos */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#102A43]">
                  3-qadam: Avtomobil rasmlarini yuklang
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  10 tagacha sifatli fotosurat yuklashingiz mumkin. Birinchi rasm asosiy bo'lib ko'rinadi.
                </p>
              </div>

              {/* Add image URL input */}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Rasm havolasini kiriting (https://...)"
                  className="flex-1 h-12 px-4 rounded-xl border border-gray-300 focus:border-[#1769AA] text-sm text-gray-800"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-5 h-12 rounded-xl bg-[#1769AA] text-white font-bold text-sm flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Qo'shish</span>
                </button>
              </div>

              {/* Uploaded images preview grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-16/10 rounded-2xl overflow-hidden border border-gray-200 group bg-gray-100">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#16A36A] text-white font-black text-[10px] uppercase shadow-md">
                        Asosiy rasm
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(idx)}
                          className="px-2 py-1 rounded bg-white text-xs font-bold text-gray-800"
                        >
                          Asosiy qilish
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 rounded-full bg-red-600 text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ortga</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-3 rounded-xl bg-[#1769AA] hover:bg-[#102A43] text-white font-bold text-sm flex items-center gap-2 shadow-md"
                >
                  <span>Davom etish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Price & Contact Info */}
          {currentStep === 4 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#102A43]">
                  4-qadam: Narx va aloqa ma'lumotlari
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Barcha narxlar strictly O'zbekiston so'mida (UZS).
                </p>
              </div>

              {/* Price in UZS */}
              <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100 space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-[#102A43]">
                  Narxi (Faqat so'mda - UZS)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    value={priceUzs}
                    onChange={(e) => setPriceUzs(Number(e.target.value))}
                    className="w-full h-14 px-4 rounded-xl border border-gray-300 focus:border-[#1769AA] font-black text-xl text-[#102A43] bg-white"
                  />
                  <span className="absolute right-4 top-4 font-black text-gray-500">so'm</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1769AA]">
                    Ko'rinishi: {formatPriceUZS(priceUzs, language)}
                  </span>
                  <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNegotiable}
                      onChange={(e) => setIsNegotiable(e.target.checked)}
                      className="rounded text-[#1769AA]"
                    />
                    <span>Kelishiladi</span>
                  </label>
                </div>
              </div>

              {/* Region & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Viloyat
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                  >
                    {UZBEKISTAN_REGIONS.map((r) => (
                      <option key={r.id} value={r.name_uz}>{r.name_uz}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Shahar / Tuman
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                  />
                </div>
              </div>

              {/* Seller contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Ismingiz
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Telefon raqam
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Telegram username
                  </label>
                  <input
                    type="text"
                    value={contactTelegram}
                    onChange={(e) => setContactTelegram(e.target.value)}
                    placeholder="@username"
                    className="w-full h-12 px-3.5 rounded-xl border border-gray-300 focus:border-[#1769AA] font-semibold text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Avtomobil haqida qo'shimcha ma'lumot
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#1769AA] text-sm text-gray-800"
                />
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ortga</span>
                </button>
                <button
                  type="submit"
                  className="px-10 py-3.5 rounded-xl bg-[#16A36A] hover:bg-[#138A59] text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/20"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>E'lonni chop etish</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Success Confirmation */}
          {currentStep === 5 && submittedVehicle && (
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#16A36A] mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-[#102A43]">
                Tabriklaymiz! E'loningiz muvaffaqiyatli joylashtirildi!
              </h2>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                {submittedVehicle.brand_name} {submittedVehicle.model_name} {submittedVehicle.year} e'loningiz AVTOBOZOR.UZ portaliga qo'shildi va xaridorlarga ko'rinmoqda.
              </p>

              <div className="bg-gray-50 max-w-sm mx-auto p-4 rounded-2xl border border-gray-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Narx:</span>
                  <span className="font-black text-[#102A43]">{formatPriceUZS(submittedVehicle.price_uzs, language)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Hudud:</span>
                  <span className="font-bold text-gray-800">{submittedVehicle.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Telefon:</span>
                  <span className="font-bold text-gray-800">{submittedVehicle.contact_phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link
                  to={`/vehicle/${submittedVehicle.id}`}
                  className="px-8 py-3.5 rounded-xl bg-[#1769AA] text-white font-bold text-sm shadow-md"
                >
                  E'lonni ko'rish
                </Link>
                <Link
                  to="/cabinet"
                  className="px-8 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm"
                >
                  Shaxsiy kabinetga o'tish
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
