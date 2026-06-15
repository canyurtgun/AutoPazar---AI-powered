export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  _count?: {
    listings: number;
    favorites: number;
  };
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  status: 'ACTIVE' | 'SOLD' | 'PENDING' | 'REJECTED';
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: BodyType;
  color?: string;
  engineSize?: string;
  horsePower?: number;
  city: string;
  district?: string;
  condition: 'SIFIR' | 'USED';
  images: string[];
  viewCount: number;
  aiPredictedPrice?: number;
  aiConfidenceScore?: number;
  aiPriceMin?: number;
  aiPriceMax?: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: {
    id: string;
    fullName: string;
    phone?: string;
    avatarUrl?: string;
    createdAt?: string;
  };
  _count?: {
    favorites: number;
  };
}

export type FuelType = 'BENZIN' | 'DIZEL' | 'LPG' | 'ELEKTRIK' | 'HYBRID';
export type TransmissionType = 'MANUEL' | 'OTOMATIK' | 'YARI_OTOMATIK';
export type BodyType = 'SEDAN' | 'HATCHBACK' | 'SUV' | 'COUPE' | 'CABRIO' | 'STATION_WAGON' | 'MINIVAN' | 'PICKUP';

export interface ListingFilters {
  search?: string;
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  mileageMin?: number;
  mileageMax?: number;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  bodyType?: BodyType;
  city?: string;
  condition?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AIPrediction {
  prediction: {
    averagePrice: number;
    medianPrice: number;
    minPrice: number;
    maxPrice: number;
    confidenceScore: number;
    confidenceLevel: string;
    standardDeviation: number;
    sampleCount: number;
    trend: {
      direction: 'UP' | 'DOWN' | 'STABLE';
      changePercent: number;
      period: string;
    };
  };
  comparisons: Array<{
    id: string;
    title: string;
    price: number;
    year: number;
    mileage: number;
    similarityScore: number;
  }>;
  userPrice?: number;
  priceAssessment?: string;
}

export interface DashboardStats {
  stats: {
    totalUsers: number;
    totalListings: number;
    activeListings: number;
    soldListings: number;
    pendingListings: number;
    averagePrice: number;
  };
  recentListings: Listing[];
  topBrands: Array<{ brand: string; count: number }>;
}

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  BENZIN: 'Benzin',
  DIZEL: 'Dizel',
  LPG: 'LPG',
  ELEKTRIK: 'Elektrik',
  HYBRID: 'Hibrit',
};

export const TRANSMISSION_LABELS: Record<TransmissionType, string> = {
  MANUEL: 'Manuel',
  OTOMATIK: 'Otomatik',
  YARI_OTOMATIK: 'Yarı Otomatik',
};

export const BODY_TYPE_LABELS: Record<BodyType, string> = {
  SEDAN: 'Sedan',
  HATCHBACK: 'Hatchback',
  SUV: 'SUV',
  COUPE: 'Coupe',
  CABRIO: 'Cabrio',
  STATION_WAGON: 'Station Wagon',
  MINIVAN: 'Minivan',
  PICKUP: 'Pick-up',
};

export const CONDITION_LABELS: Record<string, string> = {
  SIFIR: 'Sıfır',
  USED: 'İkinci El',
};

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('tr-TR').format(num);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Az önce';
  if (minutes < 60) return `${minutes} dk önce`;
  if (hours < 24) return `${hours} saat önce`;
  if (days < 30) return `${days} gün önce`;
  return formatDate(dateStr);
}
