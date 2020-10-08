import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
import { protect } from '../middleware/authorization.js';
const {
  registerUser,
  logInUser,
  displayAllUsers,
  getCurrentUserProfile,
  forgotPassword,
} = new UserController();

/**
 * Routes
 */
router.route('/register').post(registerUser);
router.route('/login').post(logInUser);
router.route('/users').get(protect, displayAllUsers);
router.route('/users/myprofile').get(protect, getCurrentUserProfile);
router.route('/forgotPassword').post(forgotPassword);

export default router;
