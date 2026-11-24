-- ==============================================================================
-- AVTOBOZOR.UZ — DATABASE SCHEMA (PostgreSQL + Supabase RLS)
-- All prices strictly in UZS (Integer / BigInt)
-- Pre-approved brands & models for Uzbekistan Automotive Market
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE vehicle_status AS ENUM ('pending', 'approved', 'rejected', 'sold');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE fuel_type AS ENUM ('benzin', 'gaz_metan', 'gaz_propan', 'gibrid', 'elektr');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transmission_type AS ENUM ('mexanika', 'avtomat');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE body_type AS ENUM ('sedan', 'universal', 'hatchback', 'suv', 'miniven', 'tijorat');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL UNIQUE,
    telegram_username TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    role user_role DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BRANDS TABLE (Strictly pre-approved Uzbekistan market)
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MODELS TABLE (Strictly pre-approved local models)
CREATE TABLE IF NOT EXISTS public.models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    default_body_type body_type DEFAULT 'sedan',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(brand_id, name)
);

-- 6. REGIONS TABLE (O'zbekiston viloyatlari va shaharlari)
CREATE TABLE IF NOT EXISTS public.regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_uz TEXT NOT NULL UNIQUE,
    name_ru TEXT NOT NULL,
    cities JSONB NOT NULL DEFAULT '[]'::jsonb,
    order_index INT DEFAULT 0
);

-- 7. VEHICLES TABLE (All prices in UZS, strict local marketplace)
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand_id UUID NOT NULL REFERENCES public.brands(id),
    model_id UUID NOT NULL REFERENCES public.models(id),
    brand_name TEXT NOT NULL,
    model_name TEXT NOT NULL,
    year INT NOT NULL CHECK (year >= 1990 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    mileage INT NOT NULL CHECK (mileage >= 0),
    fuel_type fuel_type NOT NULL DEFAULT 'benzin',
    transmission transmission_type NOT NULL DEFAULT 'mexanika',
    body_type body_type NOT NULL DEFAULT 'sedan',
    engine_volume NUMERIC(2, 1) DEFAULT 1.5,
    color TEXT NOT NULL,
    color_hex TEXT,
    price_uzs BIGINT NOT NULL CHECK (price_uzs > 0), -- ONLY UZS SO'M
    is_negotiable BOOLEAN DEFAULT TRUE,
    region TEXT NOT NULL,
    city TEXT NOT NULL,
    description TEXT,
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    status vehicle_status DEFAULT 'pending', -- Default requires admin approval
    is_premium BOOLEAN DEFAULT FALSE,
    is_recommended BOOLEAN DEFAULT FALSE,
    is_verified_seller BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    contact_phone TEXT NOT NULL,
    contact_telegram TEXT,
    contact_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. VEHICLE IMAGES TABLE (Up to 10 images per ad)
CREATE TABLE IF NOT EXISTS public.vehicle_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, vehicle_id)
);

-- 10. SAVED SEARCHES TABLE
CREATE TABLE IF NOT EXISTS public.saved_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    filters JSONB NOT NULL,
    notify_on_new BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. REPORTS TABLE (Shikoyatlar)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    reporter_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reporter_phone TEXT,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. INDEXES FOR HIGH PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON public.vehicles(price_uzs);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand_model ON public.vehicles(brand_name, model_name);
CREATE INDEX IF NOT EXISTS idx_vehicles_year ON public.vehicles(year);
CREATE INDEX IF NOT EXISTS idx_vehicles_region ON public.vehicles(region);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON public.vehicles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vehicle_images_vehicle_id ON public.vehicle_images(vehicle_id);

-- 14. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Brands, Models, Regions are public readable
CREATE POLICY "Public read brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Public read models" ON public.models FOR SELECT USING (true);
CREATE POLICY "Public read regions" ON public.regions FOR SELECT USING (true);

-- Profiles
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Vehicles: Everyone can see 'approved' vehicles. Owner can see own even if pending/rejected. Admins can see all.
CREATE POLICY "Public read approved vehicles" ON public.vehicles FOR SELECT USING (
    status = 'approved' OR 
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

CREATE POLICY "Authenticated users can insert vehicles" ON public.vehicles FOR INSERT WITH CHECK (
    auth.uid() = user_id
);

CREATE POLICY "Users can update own vehicles" ON public.vehicles FOR UPDATE USING (
    auth.uid() = user_id OR
    (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

CREATE POLICY "Users can delete own vehicles" ON public.vehicles FOR DELETE USING (
    auth.uid() = user_id OR
    (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
);

-- Vehicle images
CREATE POLICY "Public read vehicle images" ON public.vehicle_images FOR SELECT USING (true);
CREATE POLICY "Users can manage vehicle images" ON public.vehicle_images FOR ALL USING (
    EXISTS (SELECT 1 FROM public.vehicles WHERE id = vehicle_id AND (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);

-- Favorites
CREATE POLICY "Users manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Reports
CREATE POLICY "Authenticated or guests can create reports" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view and update reports" ON public.reports FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Notifications
CREATE POLICY "Users read own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- 15. INITIAL SEED DATA (Only Pre-approved Uzbekistan Models)
INSERT INTO public.brands (name, slug) VALUES 
('Chevrolet', 'chevrolet'),
('Ravon', 'ravon'),
('Daewoo', 'daewoo')
ON CONFLICT (name) DO NOTHING;

-- Seed Chevrolet Models
DO $$
DECLARE
    chevrolet_id UUID;
BEGIN
    SELECT id INTO chevrolet_id FROM public.brands WHERE slug = 'chevrolet';
    IF chevrolet_id IS NOT NULL THEN
        INSERT INTO public.models (brand_id, name, slug, default_body_type) VALUES
        (chevrolet_id, 'Cobalt', 'cobalt', 'sedan'),
        (chevrolet_id, 'Gentra', 'gentra', 'sedan'),
        (chevrolet_id, 'Lacetti', 'lacetti', 'sedan'),
        (chevrolet_id, 'Nexia 1', 'nexia-1', 'sedan'),
        (chevrolet_id, 'Nexia 2', 'nexia-2', 'sedan'),
        (chevrolet_id, 'Nexia 3', 'nexia-3', 'sedan'),
        (chevrolet_id, 'Damas', 'damas', 'miniven'),
        (chevrolet_id, 'Labo', 'labo', 'tijorat'),
        (chevrolet_id, 'Spark', 'spark', 'hatchback'),
        (chevrolet_id, 'Matiz', 'matiz-chevrolet', 'hatchback'),
        (chevrolet_id, 'Onix', 'onix', 'sedan'),
        (chevrolet_id, 'Tracker', 'tracker', 'suv'),
        (chevrolet_id, 'Malibu', 'malibu', 'sedan'),
        (chevrolet_id, 'Captiva', 'captiva', 'suv'),
        (chevrolet_id, 'Equinox', 'equinox', 'suv')
        ON CONFLICT (brand_id, name) DO NOTHING;
    END IF;
END $$;

-- Seed Ravon Models
DO $$
DECLARE
    ravon_id UUID;
BEGIN
    SELECT id INTO ravon_id FROM public.brands WHERE slug = 'ravon';
    IF ravon_id IS NOT NULL THEN
        INSERT INTO public.models (brand_id, name, slug, default_body_type) VALUES
        (ravon_id, 'R2', 'r2', 'hatchback'),
        (ravon_id, 'R3', 'r3', 'sedan'),
        (ravon_id, 'R4', 'r4', 'sedan')
        ON CONFLICT (brand_id, name) DO NOTHING;
    END IF;
END $$;

-- Seed Daewoo Models
DO $$
DECLARE
    daewoo_id UUID;
BEGIN
    SELECT id INTO daewoo_id FROM public.brands WHERE slug = 'daewoo';
    IF daewoo_id IS NOT NULL THEN
        INSERT INTO public.models (brand_id, name, slug, default_body_type) VALUES
        (daewoo_id, 'Tico', 'tico', 'hatchback'),
        (daewoo_id, 'Matiz', 'matiz-daewoo', 'hatchback'),
        (daewoo_id, 'Nexia', 'nexia-daewoo', 'sedan')
        ON CONFLICT (brand_id, name) DO NOTHING;
    END IF;
END $$;

-- Seed Regions & Major Cities
INSERT INTO public.regions (name_uz, name_ru, cities, order_index) VALUES
('Toshkent shahri', 'г. Ташкент', '["Chilonzor", "Yunusobod", "Mirzo Ulug''bek", "Yakkasaroy", "Mirobod", "Shayxontohur", "Olmazor", "Uchtepa", "Yashnobod", "Sergeli", "Bektemir", "Yangihayot"]'::jsonb, 1),
('Toshkent viloyati', 'Ташкентская область', '["Chirchiq", "Olmaliq", "Angren", "Bo''ka", "Bekobod", "Yangiyo''l", "Qibray", "Zangiota", "Parkent", "Piskent", "Chinoz", "O''rtachirchiq"]'::jsonb, 2),
('Samarqand', 'Самаркандская область', '["Samarqand sh.", "Kattaqo''rg''on", "Urgut", "Oqdaryo", "Bulung''ur", "Jomboy", "Ishtixon", "Payariq", "Pastdarg''om", "Tayloq"]'::jsonb, 3),
('Farg''ona', 'Ферганская область', '["Farg''ona sh.", "Qo''qon", "Marg''ilon", "Quva", "Oltiariq", "Rishton", "Beshariq", "Bog''dod", "Uchko''prik"]'::jsonb, 4),
('Andijon', 'Андижанская область', '["Andijon sh.", "Asaka", "Xonobod", "Shahrixon", "Baliqchi", "Bo''z", "Buloqboshi", "Izboskan", "Qo''rg''ontepa", "Marhamat"]'::jsonb, 5),
('Namangan', 'Наманганская область', '["Namangan sh.", "Chust", "Pop", "Kosonsoy", "To''raqo''rg''on", "Uychi", "Yangiqo''rg''on", "Uchqo''rg''on"]'::jsonb, 6),
('Buxoro', 'Бухарская область', '["Buxoro sh.", "G''ijduvon", "Kogon", "Vobkent", "Jondor", "Olot", "Peshku", "Qorako''l", "Romitan", "Shofirkon"]'::jsonb, 7),
('Qashqadaryo', 'Кашкадарьинская область', '["Qarshi sh.", "Shahrisabz", "Kitob", "Koson", "G''uzor", "Dehqonobod", "Qamashi", "Kasbi", "Muborak", "Nishon", "Yakkabog''"]'::jsonb, 8),
('Surxondaryo', 'Сурхандарьинская область', '["Termiz sh.", "Denov", "Sherobod", "Boysun", "Jarqo''rg''on", "Qumqo''rg''on", "Sariosiyo", "Sho''rchi", "Uzun"]'::jsonb, 9),
('Xorazm', 'Хорезмская область', '["Urganch sh.", "Xiva", "Bog''ot", "Gurlan", "Qo''shko''pir", "Shovot", "Xonqa", "Hazorasp", "Yangiariq"]'::jsonb, 10),
('Navoiy', 'Навоийская область', '["Navoiy sh.", "Zarafshon", "Karmana", "Qiziltepa", "Nurota", "Xatirchi", "Uchquduq"]'::jsonb, 11),
('Jizzax', 'Джизакская область', '["Jizzax sh.", "G''allaorol", "Zomin", "Do''stlik", "Zarbdor", "Paxtakor", "Mirzacho''l", "Baxmal"]'::jsonb, 12),
('Sirdaryo', 'Сырдарьинская область', '["Guliston sh.", "Shirin", "Yangiyer", "Boyovut", "Sayxunobod", "Sardoba", "Oqoltin", "Xovos"]'::jsonb, 13),
('Qoraqalpog''iston Respublikasi', 'Республика Каракалпакстан', '["Nukus sh.", "Beruniy", "To''rtko''l", "Xo''jayli", "Chimboy", "Qo''ng''irot", "Mo''ynoq", "Amudaryo", "Taxiatosh"]'::jsonb, 14)
ON CONFLICT (name_uz) DO NOTHING;
