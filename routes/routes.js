import express from 'express';
const router = express.Router();
import UserController from '../controllers/users.js';
import NoteController from '../controllers/notes.js';
import { auth } from '../middleware/authorization.js';
const {
  createNote,
  getNotes,
  updateSingleNote,
  getSingleNote,
  deleteSingleNote,
  getUserNotes,
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
router.route('/forgotPassword').post(forgotPassword);
router.route('/fundooapp/resetpassword/:resettoken').put(resetPassword);

/**
 * Note Routes
 */
router.route('/notes').get(auth, getNotes);
router
  .route('/notes/:id')
  .get(auth, getSingleNote)
  .delete(auth, deleteSingleNote)
  .put(auth, updateSingleNote);

/**
 * User Profile
 */
router.route('/users/myprofile').get(auth, getCurrentUserProfile);
router.route('/users/myprofile/notes').get(auth, getUserNotes).post(auth, createNote);

export default router;
