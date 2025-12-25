import { Router } from 'express';
import { LocationController } from '../controllers/locationController';
import { UserController } from '../controllers/userController';

const router = Router();
const locationController = new LocationController();
const userController = new UserController();

// User Routes
router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);

// Location Routes
router.get('/provinces', locationController.getAllProvinces);
router.get('/districts/:provinceId', locationController.getDistrictsByProvinceId);
router.get('/neighborhoods/:districtId', locationController.getNeighborhoodsByDistrictId);

export default router;
