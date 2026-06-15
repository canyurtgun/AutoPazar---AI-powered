import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';

const router = Router();

router.post('/predict', (req, res) => aiController.predict(req, res));
router.get('/market-stats', (req, res) => aiController.getMarketStats(req, res));

export default router;
