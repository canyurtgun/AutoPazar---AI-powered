import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('❌ Hata:', err.message);
  console.error(err.stack);

  res.status(500).json({
    error: 'Sunucu hatası oluştu',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}
