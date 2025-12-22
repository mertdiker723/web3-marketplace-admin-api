import { Router } from 'express';
import { LocationController } from '../controllers/locationController';

const router = Router();
const locationController = new LocationController();

// Location Routes
router.get('/provinces', locationController.getAllProvinces);
router.get('/districts/:provinceId', locationController.getDistrictsByProvinceId);
router.get('/neighborhoods/:districtId', locationController.getNeighborhoodsByDistrictId);

export default router;
