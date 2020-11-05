import logger from '../config/logger.js';
import CollaboratorService from '../services/collaboratorService.js';
const {
  findAllEmailIds,
  createNewCollaborator,
  deleteCollaboratorFromNote,
  getAllCollaborators,
} = new CollaboratorService();

class CollaboratorController {
  /**
   * @description Gets all the registered emailids
   * @route GET /get-all-registered-emails
   * @param {Object} req
   * @param {Object} res
   */
  getAllRegisteredEmailIds = async (req, res) => {
    const responseData = {};
    try {
      const result = await findAllEmailIds();
      responseData.success = true;
      responseData.message = 'Showing All registered emailIds from DataBase';
      responseData.data = result;
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(error.statusCode || 500).send(responseData);
    }
  };

  /**
   * @description Create New Colloaborator
   * @route POST /collaborators
   * @param {Object} req
   * @param {Object} res
   */
  createCollaborator = async (req, res) => {
    const responseData = {};
    try {
      const collaboratorObject = {
        collaboratorEmail: req.body.collaboratorEmail,
        noteId: req.body.noteId,
        userId: req.user._id,
      };
      const result = await createNewCollaborator(collaboratorObject);
      responseData.success = true;
      responseData.message = 'Successfully created collabrator!';
      responseData.data = result;
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message, error.stack);
      res.status(error.statusCode || 500).send(responseData);
    }
  };

  /**
   * @description Delete Collabrators
   * @route Delete /collaborators
   * @param {Object} req
   * @param {Object} res
   */
  deleteCollaborator = async (req, res) => {
    const responseData = {};
    try {
      const collabratorObject = {
        collaboratorId: req.body.collaboratorId,
        noteId: req.body.noteId,
      };
      const result = await deleteCollaboratorFromNote(collabratorObject);
      responseData.success = true;
      responseData.message = 'Successfully deleted collabrator!';
      responseData.data = result;
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(error.statusCode || 500).send(responseData);
    }
  };

  /**
   * Gets all the labels from the db
   */

  getCollaborators = async (req, res) => {
    const responseData = {};
    try {
      const result = await getAllCollaborators();
      responseData.success = true;
      responseData.data = result;
      responseData.message = 'Showing All Collaborators from db';
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(error.statusCode || 500).send(responseData);
    }
  };
}

export default CollaboratorController;
