import { Request, Response } from 'express';
import { listingService } from '../services/listing.service.js';
import { AuthRequest, ListingFilterQuery } from '../types/index.js';
import { z } from 'zod';

const createListingSchema = z.object({
  title: z.string().min(5, 'Başlık en az 5 karakter olmalıdır'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalıdır'),
  price: z.number().positive('Fiyat pozitif olmalıdır'),
  brand: z.string().min(1, 'Marka gereklidir'),
  model: z.string().min(1, 'Model gereklidir'),
  year: z.number().int().min(1980).max(2025),
  mileage: z.number().int().min(0),
  fuelType: z.enum(['BENZIN', 'DIZEL', 'LPG', 'ELEKTRIK', 'HYBRID']),
  transmission: z.enum(['MANUEL', 'OTOMATIK', 'YARI_OTOMATIK']),
  bodyType: z.enum(['SEDAN', 'HATCHBACK', 'SUV', 'COUPE', 'CABRIO', 'STATION_WAGON', 'MINIVAN', 'PICKUP']),
  color: z.string().optional(),
  engineSize: z.string().optional(),
  horsePower: z.number().int().optional(),
  city: z.string().min(1, 'Şehir gereklidir'),
  district: z.string().optional(),
  condition: z.enum(['SIFIR', 'USED']).optional(),
  images: z.array(z.string()).optional(),
});

export class ListingController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query as ListingFilterQuery;
      const result = await listingService.getAll(filters);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const listing = await listingService.getById(req.params.id as string);
      res.json(listing);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const data = createListingSchema.parse(req.body);
      const listing = await listingService.create(req.user!.userId, data as any);
      res.status(201).json(listing);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Doğrulama hatası', details: error.errors });
        return;
      }
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const listing = await listingService.update(
        req.params.id as string,
        req.user!.userId,
        req.user!.role,
        req.body
      );
      res.json(listing);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await listingService.delete(req.params.id as string, req.user!.userId, req.user!.role);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMyListings(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '12', 10);
      const result = await listingService.getMyListings(req.user!.userId, page, limit);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async toggleFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await listingService.toggleFavorite(req.user!.userId, req.params.id as string);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getFavorites(req: AuthRequest, res: Response): Promise<void> {
    try {
      const favorites = await listingService.getFavorites(req.user!.userId);
      res.json(favorites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getBrands(_req: Request, res: Response): Promise<void> {
    try {
      const brands = await listingService.getBrands();
      res.json(brands);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCities(_req: Request, res: Response): Promise<void> {
    try {
      const cities = await listingService.getCities();
      res.json(cities);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const listingController = new ListingController();
