# AVTOBOZOR.UZ — O'zbekiston №1 Zamonaviy Avtomobil Bozori

**AVTOBOZOR.UZ** — O'zbekiston aholisi uchun maxsus ishlab chiqilgan, Avtoelon uslubidagi, lekin ancha zamonaviy, tezkor, xavfsiz va qulay premium avtomobil oldi-sotdi platformasi.

---

## 🚀 Asosiy Qoidalar va Imkoniyatlar

1. **Faqat O'zbekiston so'mida (UZS)**:
   - Platformadagi barcha narxlar faqat milliy valyuta (so'm)da saqlanadi va ko'rsatiladi.
   - Minglik ajratkichlar bilan chiroyli formatlangan (masalan: `120 000 000 so'm`).
   - Dollar, rubl va boshqa chet el valyutalariga mutlaqo o'rin yo'q.

2. **Faqat Tasdiqlangan Mahalliy Avtomobillar**:
   - **CHEVROLET:** Cobalt, Gentra, Lacetti, Nexia 1, Nexia 2, Nexia 3, Damas, Labo, Spark, Matiz, Onix, Tracker, Malibu, Captiva, Equinox.
   - **RAVON:** R2, R3, R4.
   - **DAEWOO:** Tico, Matiz, Nexia.
   - Yangi marka va modellar faqat admin tomonidan katalogga kiritiladi.

3. **To'liq Ikki Tillilik (O'zbekcha va Ruscha)**:
   - `i18next` tizimi asosida barcha interfeys, shakllar, bildirishnomalar va xatoliklar UZ va RU tillarida.
   - Foydalanuvchi tanlagan til `localStorage` da avtomatik saqlanib qoladi.

4. **Avtoelon Uslubidagi Professional UI/UX**:
   - Asosiy ko'k rang: `#1769AA`
   - To'q ko'k (Navy): `#102A43`
   - Yorqin yashil CTA (E'lon berish): `#16A36A`
   - Fon: `#F4F7FB`
   - Matn: `#263445`

5. **Keng Qamrovli Funksional**:
   - **Qidiruv va Kengaytirilgan Filtrlar:** Marka, model, narx oralig'i (UZS), yil oralig'i, yoqilg'i (benzin, metan, propan, gibrid, elektr), uzatmalar qutisi (avtomat, mexanika), kuzov turi, 14 ta O'zbekiston viloyati va saralash (eng arzon, eng qimmat, eng yangi, eng ommabop).
   - **Avtomobil kartochkasi va tafsilotlar:** Ko'p rasmli galereya, texnik spetsifikatsiyalar jadvali, xavfsizlik eslatmasi, telefon raqamini ko'rsatish (`Raqamni ko'rsatish`), Telegram orqali to'g'ridan-to'g'ri bog'lanish, kredit kalkulyatori (oylik to'lovni so'mda hisoblash).
   - **5 Bosqichli E'lon Berish:** Marka va model tanlash -> Texnik xarakteristikalar -> Rasmlar yuklash -> Narx va aloqa ma'lumotlari -> Tekshirish va chop etish.
   - **Taqqoslash Tizimi (`/compare`):** Bir vaqtning o'zida 4 tagacha avtomobilni xususiyatlari bo'yicha yonma-yon solishtirish.
   - **Sevimlilar (`/favorites`):** Tanlangan e'lonlarni saqlash va kuzatish.
   - **Saqlangan Qidiruvlar:** Qidiruv mezonlarini saqlash va yangi e'lonlarni monitoring qilish.
   - **Rasmiy Avtosalonlar (`/dealerships`):** Driver's Village, Rohat Avto, Sergeli Avtomarket va boshqa tasdiqlangan dilerlik markazlari.
   - **Foydalanuvchi Kabineti (`/cabinet`):** Mening e'lonlarim, faol/sotilgan holati, bildirishnomalar, profil sozlamalari.
   - **Admin Moderatsiya Paneli (`/admin`):** Yangi e'lonlarni tasdiqlash/rad etish, shikoyatlarni ko'rib chiqish, e'lonlarni o'chirish, katalog nazorati.

---

## 🛠 Texnologiyalar Steki

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React Icons
- **Marshrutlash:** React Router DOM v6
- **Tarjima (i18n):** i18next, react-i18next
- **Ma'lumotlar Bazasi:** Supabase PostgreSQL (RLS xavfsizlik qoidalari, triggerlar va boshlang'ich katalog ma'lumotlari bilan `supabase_schema.sql` faylida tayyorlangan)
- **Ishlash rejimi:** 100% mustaqil Demo rejim (Supabase ulangan taqdirda ham, ulanmagan taqdirda ham to'liq ishlaydi).

---

## 💻 Loyihani Ishga Tushirish

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Dasturchi rejimida ishga tushirish (port 3000)
npm run dev

# 3. Loyihani ishlab chiqarish (production) uchun yig'ish
npm run build

# 4. Yig'ilgan loyihani ko'rish
npm run preview
```

---

## 👥 Demo Sinov Foydalanuvchilari (1-Click Login)

Saytda sinovdan o'tkazish juda qulay bo'lishi uchun tizimda quyidagi demo foydalanuvchilar o'rnatilgan:
1. **Jasur Boboyev (Oddiy foydalanuvchi / Sotuvchi)**
   - Telefon: `+998 90 123 45 67`
   - SMS kod: `7777`
2. **Avtobozor Administrator (Moderator)**
   - Telefon: `+998 71 200 00 00`
   - Kirish huquqi: `/admin` paneli to'liq ochiq
