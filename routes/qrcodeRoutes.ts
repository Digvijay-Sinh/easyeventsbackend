import express from 'express';
import { qrcodeController} from '../controller/qrcodeController';

const router = express.Router();

// Route to generate a QR code
router.post('/generate', qrcodeController);

// Route to get a QR code

export default router;