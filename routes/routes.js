import express from 'express';
const router = express.Router();
import UserController from '../controllers/users.js';
import NoteController from '../controllers/notes.js';
import LabelController from '../controllers/labels.js';
import RedisCache from '../middleware/redisCache.js';
import { auth } from '../middleware/authorization.js';
import { verifyEmail } from '../middleware/emailVerification.js';
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
  emailVerification,
} = new UserController();
const { createLabelAndAddToNote, deleteLabel, getAllLabels } = new LabelController();
const { getDataFromCache } = new RedisCache();

/**
 * Auth Routes
 */
router.route('/register').post(registerUser);
router.route('/login').post(verifyEmail, logInUser);
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
router
  .route('/users/myprofile/notes')
  .get(auth, getDataFromCache, getUserNotes)
  .post(auth, createNote);
router.route('/fundooapp/verify-email/:token').get(emailVerification);

/**
 * Labels
 */
router
  .route('/labels')
  .get(auth, getAllLabels)
  .post(auth, createLabelAndAddToNote)
  .delete(auth, deleteLabel);

export default router;
