import { Router } from 'express';

// Controllers
import { LocationController } from '../controllers/locationController';
import { UserController } from '../controllers/userController';
import { BrandController } from '../controllers/brandController';

// Middlewares
import { adminAuthorizationMiddleware, authMiddleware, superAdminAuthorizationMiddleware } from '../middlewares/auth';

const router = Router();
const locationController = new LocationController();
const userController = new UserController();
const brandController = new BrandController();

// User Routes
router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);
router.get('/users/me', authMiddleware, adminAuthorizationMiddleware, userController.getUser);
router.get('/users/:id', authMiddleware, superAdminAuthorizationMiddleware, userController.getUser);
router.get('/users', authMiddleware, superAdminAuthorizationMiddleware, userController.getAllUsers);
router.delete('/users/:id', authMiddleware, superAdminAuthorizationMiddleware, userController.deleteUser);
router.put('/users/:id', authMiddleware, superAdminAuthorizationMiddleware, userController.updateUserInfo);
router.put('/users/:id/profile', authMiddleware, adminAuthorizationMiddleware, userController.updateUserProfile);

// Location Routes
router.get('/provinces', authMiddleware, adminAuthorizationMiddleware, locationController.getAllProvinces);
router.get('/districts/:provinceId', authMiddleware, adminAuthorizationMiddleware, locationController.getDistrictsByProvinceId);
router.get('/neighborhoods/:districtId', authMiddleware, adminAuthorizationMiddleware, locationController.getNeighborhoodsByDistrictId);

// Brand Routes
router.post('/brands', authMiddleware, superAdminAuthorizationMiddleware, brandController.createBrand);
router.get('/brands', authMiddleware, adminAuthorizationMiddleware, brandController.getAllBrands);
router.delete('/brands/:id', authMiddleware, superAdminAuthorizationMiddleware, brandController.deleteBrand);
router.get('/brands/:id', authMiddleware, adminAuthorizationMiddleware, brandController.getBrandById);
router.put('/brands/:id', authMiddleware, superAdminAuthorizationMiddleware, brandController.updateBrand);

export default router;
