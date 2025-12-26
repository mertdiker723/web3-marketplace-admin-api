import { Router } from 'express';

// Controllers
import { LocationController } from '../controllers/locationController';
import { UserController } from '../controllers/userController';

// Middlewares
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const locationController = new LocationController();
const userController = new UserController();

// User Routes
router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);
router.get('/users/me', authMiddleware, userController.getUser);

// Location Routes
router.get('/provinces', authMiddleware, locationController.getAllProvinces);
router.get('/districts/:provinceId', authMiddleware, locationController.getDistrictsByProvinceId);
router.get('/neighborhoods/:districtId', authMiddleware, locationController.getNeighborhoodsByDistrictId);

export default router;
