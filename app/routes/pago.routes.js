import express from 'express';
import { generarPago, generarCheckout } from '../controllers/pago.controller.js';

const router = express.Router();

router.post('/api/pago', generarPago);
router.post('/api/checkout', generarCheckout);

export default router;