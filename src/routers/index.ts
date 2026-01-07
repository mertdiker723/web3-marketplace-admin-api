import { Router } from 'express';

// Controllers
import { LocationController } from '../controllers/locationController';
import { UserController } from '../controllers/userController';

// Middlewares
import { adminAuthorizationMiddleware, authMiddleware, superAdminAuthorizationMiddleware } from '../middlewares/auth';

const router = Router();
const locationController = new LocationController();
const userController = new UserController();

// User Routes
router.post('/users/register', userController.registerUser);
router.post('/users/login', userController.loginUser);
router.get('/users/me', authMiddleware, adminAuthorizationMiddleware, userController.getUser);
router.get('/users', authMiddleware, superAdminAuthorizationMiddleware, userController.getAllUsers);
router.delete('/users/:id', authMiddleware, superAdminAuthorizationMiddleware, userController.deleteUser);
router.get('/users/:id', authMiddleware, superAdminAuthorizationMiddleware, userController.getSelectedUser);
router.put('/users/:id', authMiddleware, superAdminAuthorizationMiddleware, userController.updateUser);

// Location Routes
router.get('/provinces', authMiddleware, adminAuthorizationMiddleware, locationController.getAllProvinces);
router.get('/districts/:provinceId', authMiddleware, adminAuthorizationMiddleware, locationController.getDistrictsByProvinceId);
router.get('/neighborhoods/:districtId', authMiddleware, adminAuthorizationMiddleware, locationController.getNeighborhoodsByDistrictId);

export default router;
