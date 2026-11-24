export type Language = 'uz' | 'ru';

export type UserRole = 'user' | 'admin';

export type VehicleStatus = 'pending' | 'approved' | 'rejected' | 'sold';

export type FuelType = 'benzin' | 'gaz_metan' | 'gaz_propan' | 'gibrid' | 'elektr';

export type TransmissionType = 'mexanika' | 'avtomat';

export type BodyType = 'sedan' | 'universal' | 'hatchback' | 'suv' | 'miniven' | 'tijorat';

export interface UserProfile {
  id: string;
  full_name: string;
  phone_number: string;
  telegram_username?: string;
  avatar_url?: string;
  is_verified: boolean;
  role: UserRole;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  is_active: boolean;
  models?: string[];
}

export interface Model {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  default_body_type: BodyType;
  is_active: boolean;
}

export interface Region {
  id: string;
  name_uz: string;
  name_ru: string;
  cities: string[];
}

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  is_primary: boolean;
  order_index: number;
}

export interface Vehicle {
  id: string;
  user_id: string;
  brand_name: string;
  model_name: string;
  year: number;
  mileage: number; // in kilometers
  fuel_type: FuelType;
  transmission: TransmissionType;
  body_type: BodyType;
  engine_volume: number; // e.g. 1.5, 2.0
  color: string;
  color_hex?: string;
  price_uzs: number; // Strictly in UZS
  is_negotiable: boolean;
  region: string;
  city: string;
  description: string;
  features: string[];
  status: VehicleStatus;
  is_premium: boolean;
  is_recommended: boolean;
  is_verified_seller: boolean;
  views_count: number;
  favorites_count: number;
  contact_phone: string;
  contact_telegram?: string;
  contact_name: string;
  created_at: string;
  updated_at: string;
  images: string[]; // URLs
}

export interface FilterParams {
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minMileage?: number;
  maxMileage?: number;
  fuelType?: FuelType | '';
  transmission?: TransmissionType | '';
  bodyType?: BodyType | '';
  region?: string;
  city?: string;
  color?: string;
  searchQuery?: string;
  sortBy?: 'cheap' | 'expensive' | 'newest' | 'popular';
  isVerifiedSeller?: boolean;
}

export interface SavedSearch {
  id: string;
  user_id: string;
  title: string;
  filters: FilterParams;
  created_at: string;
}

export interface Report {
  id: string;
  vehicle_id: string;
  vehicle_title: string;
  reporter_phone?: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  created_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'price_drop';
  is_read: boolean;
  link?: string;
  created_at: string;
}
