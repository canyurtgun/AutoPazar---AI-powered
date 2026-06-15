import { Router } from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

const router = Router();

// Tüm admin rotaları auth + admin middleware gerektirir
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/dashboard', (req, res) => adminController.getDashboard(req, res));
router.get('/listings', (req, res) => adminController.getAllListings(req, res));
router.put('/listings/:id/status', (req, res) => adminController.updateListingStatus(req, res));
router.get('/users', (req, res) => adminController.getAllUsers(req, res));
router.put('/users/:id/status', (req, res) => adminController.updateUserStatus(req, res));

export default router;
