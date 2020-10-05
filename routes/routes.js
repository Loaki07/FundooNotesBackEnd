import express from 'express';
const router = express.Router();
import {
  registerUser,
  logInUser,
  updateUser,
  userById,
  deleteUser,
  displayAllUsers,
} from '../controllers/userController.js';

/**
 * Routes
 */
router.get('/', (req, res) => {
  res.status(200).send('Welcome to the Fundoo Notes Application');
});

router.get('/login', (req, res) => {
  res.status(200).send('login page');
});

router.get('/register', (req, res) => {
  res.status(200).send('register page');
});

router.route('/register').post(registerUser);
router.route('/login').post(logInUser);

router.route('/users/updateUser/:id').get(userById).put(updateUser).delete(deleteUser);
router.route('/users').get(displayAllUsers);

export default router;
