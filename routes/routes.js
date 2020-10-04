  import express from 'express';
const router = express.Router();
import { registerUser, logInUser } from '../controllers/userController.js';

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

router.post('/register', registerUser);
router.post('/login', logInUser);

export default router;
