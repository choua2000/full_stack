import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router();

router.post('/Signup', userController.registerUser);
router.post('/Login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.get('/gets/', userController.getAllUsers);
router.put('/update-password', userController.updatePassword);
export default router;