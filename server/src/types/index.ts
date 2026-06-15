import { Request } from 'express';

export type Role = 'USER' | 'ADMIN';

export interface AuthPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface ListingFilterQuery extends PaginationQuery {
  search?: string;
  brand?: string;
  model?: string;
  yearMin?: string;
  yearMax?: string;
  priceMin?: string;
  priceMax?: string;
  mileageMin?: string;
  mileageMax?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  city?: string;
  condition?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface AIPredictionRequest {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  city?: string;
  condition?: string;
}

export interface AIPredictionResponse {
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
