import { Request, Response } from 'express';
import { adminService } from '../services/admin.service.js';

export class AdminController {
  async getDashboard(_req: Request, res: Response): Promise<void> {
    try {
      const dashboard = await adminService.getDashboard();
      res.json(dashboard);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllListings(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);
      const status = req.query.status as string | undefined;
      const result = await adminService.getAllListings(page, limit, status);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateListingStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const listing = await adminService.updateListingStatus(req.params.id as string, status);
      res.json(listing);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '20', 10);
      const result = await adminService.getAllUsers(page, limit);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { isActive } = req.body;
      const user = await adminService.updateUserStatus(req.params.id as string, isActive);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

export const adminController = new AdminController();
