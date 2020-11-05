import express from 'express';
const router = express.Router();
import UserController from '../controllers/users.js';
import NoteController from '../controllers/notes.js';
import LabelController from '../controllers/labels.js';
import CollaboratorController from '../controllers/collaborators.js';
import RedisCache from '../middleware/redisCache.js';
import { auth } from '../middleware/authorization.js';
import { verifyEmail } from '../middleware/emailVerification.js';
const {
  createNote,
  getNotes,
  updateNote,
  getNote,
  deleteNote,
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
const {
  getAllRegisteredEmailIds,
  createCollaborator,
  deleteCollaborator,
  getCollaborators,
} = new CollaboratorController();
const { getDataFromCache } = new RedisCache();

/**
 * Register & Login Routes
 */
router.route('/register').post(registerUser);
router.route('/login').post(verifyEmail, logInUser);
router.route('/users').get(auth, displayAllUsers);
router.route('/forgotPassword').post(forgotPassword);
router.route('/fundooapp/resetpassword/:resettoken').put(resetPassword);

/**
 * Note Routes
 */
router
  .route('/notes/:id')
  .get(auth, getNote)
  .delete(auth, deleteNote)
  .put(auth, updateNote);

/**
 * Users
 */
router.route('/users/myprofile').get(auth, getCurrentUserProfile);
router
  .route('/users/notes')
  .get(auth, getDataFromCache, getUserNotes)
  .post(auth, createNote);

/**
 * Email Verification
 */
router.route('/fundooapp/verify-email/:token').get(emailVerification);

/**
 * Labels
 */
router
  .route('/labels')
  .get(auth, getAllLabels)
  .post(auth, createLabelAndAddToNote)
  .delete(auth, deleteLabel);

/**
 * Collaborators
 */
router.route('/get-all-user-emails').get(auth, getAllRegisteredEmailIds);
router
  .route('/collaborators')
  .get(auth, getCollaborators)
  .post(auth, createCollaborator)
  .delete(auth, deleteCollaborator);

export default router;
