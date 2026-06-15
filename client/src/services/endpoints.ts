import api from './api';
import { Listing, ListingFilters, PaginationInfo, AIPrediction, DashboardStats, User } from '../types';

// === AUTH ===
export const authAPI = {
  register: (data: { email: string; password: string; fullName: string; phone?: string }) =>
    api.post<{ user: User; token: string }>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<{ user: User; token: string }>('/auth/login', data),

  getProfile: () =>
    api.get<User>('/auth/me'),

  updateProfile: (data: { fullName?: string; phone?: string }) =>
    api.put<User>('/auth/profile', data),
};

// === LISTINGS ===
export const listingsAPI = {
  getAll: (filters?: ListingFilters) =>
    api.get<{ listings: Listing[]; pagination: PaginationInfo }>('/listings', { params: filters }),

  getById: (id: string) =>
    api.get<Listing>(`/listings/${id}`),

  create: (data: Partial<Listing>) =>
    api.post<Listing>('/listings', data),

  update: (id: string, data: Partial<Listing>) =>
    api.put<Listing>(`/listings/${id}`, data),

  delete: (id: string) =>
    api.delete(`/listings/${id}`),

  getMyListings: (page?: number) =>
    api.get<{ listings: Listing[]; pagination: PaginationInfo }>('/listings/user/my', { params: { page } }),

  toggleFavorite: (id: string) =>
    api.post<{ favorited: boolean }>(`/listings/${id}/favorite`),

  getFavorites: () =>
    api.get<Listing[]>('/listings/user/favorites'),

  getBrands: () =>
    api.get<string[]>('/listings/brands'),

  getCities: () =>
    api.get<string[]>('/listings/cities'),
};

// === AI ===
export const aiAPI = {
  predict: (data: {
    brand: string; model: string; year: number; mileage: number;
    fuelType?: string; transmission?: string; bodyType?: string;
    city?: string; condition?: string; userPrice?: number;
  }) =>
    api.post<AIPrediction>('/ai/predict', data),

  getMarketStats: () =>
    api.get('/ai/market-stats'),
};

// === ADMIN ===
export const adminAPI = {
  getDashboard: () =>
    api.get<DashboardStats>('/admin/dashboard'),

  getListings: (page?: number, status?: string) =>
    api.get<{ listings: Listing[]; pagination: PaginationInfo }>('/admin/listings', { params: { page, status } }),

  updateListingStatus: (id: string, status: string) =>
    api.put(`/admin/listings/${id}/status`, { status }),

  getUsers: (page?: number) =>
    api.get('/admin/users', { params: { page } }),

  updateUserStatus: (id: string, isActive: boolean) =>
    api.put(`/admin/users/${id}/status`, { isActive }),
};
