import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
import NoteController from '../controllers/notes.js';
import { auth } from '../middleware/authorization.js';
const {
  createNote,
  getNotes,
  updateSingleNote,
  getSingleNote,
  deleteSingleNote,
} = new NoteController();
const {
  registerUser,
  logInUser,
  displayAllUsers,
  getCurrentUserProfile,
  forgotPassword,
  resetPassword,
} = new UserController();

/**
 * Auth Routes
 */
router.route('/register').post(registerUser);
router.route('/login').post(logInUser);
router.route('/users').get(auth, displayAllUsers);
router.route('/users/myprofile').get(auth, getCurrentUserProfile);
router.route('/forgotPassword').post(forgotPassword);
router.route('/fundooapp/resetpassword/:resettoken').put(resetPassword);

/**
 * Note Routes
 */
router.route('/notes').get(auth, getNotes).post(auth, createNote);
router
  .route('/notes/:id')
  .get(auth, getSingleNote)
  .post(auth, createNote)
  .delete(auth, deleteSingleNote)
  .put(auth, updateSingleNote);

export default router;
