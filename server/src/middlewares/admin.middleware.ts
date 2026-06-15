import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/index.js';

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Bu işlem için yönetici yetkisi gereklidir' });
    return;
  }
  next();
}
