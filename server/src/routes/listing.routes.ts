import { Router } from 'express';
import { listingController } from '../controllers/listing.controller.js';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Public rotalar (parametre olmayan rotalar önce)
router.get('/', (req, res) => listingController.getAll(req, res));
router.get('/brands', (req, res) => listingController.getBrands(req, res));
router.get('/cities', (req, res) => listingController.getCities(req, res));

// Auth gerekli rotalar (parametre olmayan rotalar önce)
router.get('/user/my', authMiddleware, (req, res) => listingController.getMyListings(req, res));
router.get('/user/favorites', authMiddleware, (req, res) => listingController.getFavorites(req, res));
router.post('/', authMiddleware, (req, res) => listingController.create(req, res));

// Parametreli rotalar en sona
router.get('/:id', (req, res) => listingController.getById(req, res));
router.put('/:id', authMiddleware, (req, res) => listingController.update(req, res));
router.delete('/:id', authMiddleware, (req, res) => listingController.delete(req, res));
router.post('/:id/favorite', authMiddleware, (req, res) => listingController.toggleFavorite(req, res));

export default router;
