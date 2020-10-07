import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
const { registerUser, logInUser, displayAllUsers } = new UserController();

/**
 * Routes
 */
router.route('/register').post(registerUser);
router.route('/login').post(logInUser);
router.route('/users').get(displayAllUsers);

export default router;
