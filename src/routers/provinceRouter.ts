import { Router } from 'express';
import { ProvinceController } from '../controllers/provinceController';

const router = Router();
const provinceController = new ProvinceController();

// GET /api/provinces - Get all provinces
router.get('/', (req, res) => {
  void provinceController.getAllProvinces(req, res);
});

export default router;
