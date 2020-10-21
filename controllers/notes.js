import NoteService from '../services/noteService.js';
import validation from '../middleware/validation.js';
const { validateNote } = new validation();
import { ErrorResponse, noteErrors } from '../utility/errorResponse.js';
import logger from '../config/logger.js';
import RedisCache from '../middleware/redisCache.js';
const { setDataintoCache } = new RedisCache();
const {
  createNewNote,
  findAllNotes,
  updateNoteInDb,
  findNoteByDb,
  deleteNoteInDb,
  getNotesByUserId,
} = new NoteService();

class NoteController {
  createNote = async (req, res) => {
    const responseData = {};
    try {
      const { error } = await validateNote(req.body);
      if (error) {
        throw new ErrorResponse(`${error.message}`, 401);
      }
      req.body.userId = req.user._id;
      const result = await createNewNote(req.body);
      responseData.success = true;
      responseData.message = 'Successfully Created Note!';
      responseData.data = result;
      logger.info(responseData.message);
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(error.statusCode || 500).send(responseData);
    }
  };

  getNotes = async (req, res) => {
    const responseData = {};
    try {
      const result = await findAllNotes();
      if (!result || result === null || result.length === 0) {
        throw new ErrorResponse(noteErrors[2].error, noteErrors[2].statusCode);
      }
      responseData.success = true;
      responseData.message = 'Displaying all Notes';
      responseData.data = result;
      logger.info(responseData.message);
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(error.statusCode || 500).send(responseData);
    }
  };

  updateSingleNote = async (req, res) => {
    const responseData = {};
    try {
      const result = await updateNoteInDb(req.params.id, req.body);
      // setDataintoCache(id, result);
      responseData.success = true;
      responseData.message = 'Updated Note';
      responseData.data = result;
      logger.info(responseData.message);
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(error.statusCode || 500).send(responseData);
    }
  };

  getSingleNote = async (req, res) => {
    const responseData = {};
    try {
      const result = await findNoteByDb({
        _id: req.params.id,
        userId: req.user._id,
      });
      responseData.success = true;
      responseData.message = 'Note Found!';
      responseData.data = result;
      logger.info(responseData.message);
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(error.statusCode || 500).send(responseData);
    }
  };

  deleteSingleNote = async (req, res) => {
    const responseData = {};
    try {
      const result = await deleteNoteInDb(req.params.id);
      responseData.success = true;
      responseData.message = 'Deleted Note';
      responseData.data = result;
      logger.info(responseData.message);
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(error.statusCode || 500).send(responseData);
    }
  };

  getUserNotes = async (req, res) => {
    const responseData = {};
    try {
      let id = req.user._id;
      const result = await getNotesByUserId({
        userId: id,
      });
      setDataintoCache(id, result);
      responseData.success = true;
      responseData.message = 'User Notes form DB';
      responseData.data = result;
      logger.info(responseData.message);
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(error.statusCode || 500).send(responseData);
    }
  };
}

export default NoteController;
