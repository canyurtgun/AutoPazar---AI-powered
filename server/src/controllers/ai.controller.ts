import { Request, Response } from 'express';
import { aiService } from '../services/ai.service.js';
import { AIPredictionRequest } from '../types/index.js';
import { z } from 'zod';

const predictSchema = z.object({
  brand: z.string().min(1, 'Marka gereklidir'),
  model: z.string().min(1, 'Model gereklidir'),
  year: z.number().int().min(1980).max(2025),
  mileage: z.number().int().min(0),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  bodyType: z.string().optional(),
  city: z.string().optional(),
  condition: z.string().optional(),
  userPrice: z.number().positive().optional(),
});

export class AIController {
  async predict(req: Request, res: Response): Promise<void> {
    try {
      const data = predictSchema.parse(req.body);
      const { userPrice, ...query } = data;
      const result = await aiService.predict(query as AIPredictionRequest, userPrice);
      res.json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Doğrulama hatası', details: error.errors });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  }

  async getMarketStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await aiService.getMarketStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const aiController = new AIController();
