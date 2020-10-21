import { NoteModel } from '../models/note.js';
import { ErrorResponse, noteErrors } from '../utility/errorResponse.js';
const {
  createNote,
  getAllNotes,
  saveNote,
  updateNote,
  deleteNote,
  findOne,
  find,
} = new NoteModel();

class NoteService {
  /**
   * @description Create Notes
   * @param {Object} data 
   */
  createNewNote = async (data) => {
    try {
      const isNotePresent = await findOne({
        title: data.title,
      });
      if (isNotePresent) {
        throw new ErrorResponse(noteErrors[1].error, noteErrors[1].statusCode);
      }
      return await createNote(data);
    } catch (error) {
      throw new ErrorResponse(error.message, error.statusCode);
    }
  };

  /**
   * @description Gets all the notes from db 
   * @param {Object} req 
   * @param {Object} res 
   */
  findAllNotes = async (req, res) => {
    try {
      return await getAllNotes();
    } catch (error) {
      throw new ErrorResponse(error.message, error.statusCode);
    }
  };

  /**
   * @description Updtes Notes
   * @param {Object} id 
   * @param {Object} data 
   */
  updateNoteInDb = async (id, data) => {
    try {
      const result = await updateNote(id, data);
      if (result instanceof Error) {
        throw new ErrorResponse(error.message, 400);
      }
      return result;
    } catch (error) {
      throw new ErrorResponse(error.message, error.statusCode);
    }
  };

  /**
   * @description Finds notes by the schema fields
   * @param {Object} fields 
   */
  findNoteByDb = async (fields) => {
    try {
      const result = await findOne(fields);
      if (result instanceof Error) {
        throw new ErrorResponse(error.message, 400);
      }
      return result;
    } catch (error) {
      throw new ErrorResponse(error.message, error.statusCode);
    }
  };

  /**
   * @description Delete Note by object id
   * @param {ObjectID} id 
   */
  deleteNoteInDb = async (id) => {
    try {
      const result = await deleteNote({ _id: id });
      if (result instanceof Error) {
        throw new ErrorResponse(error.message, 400);
      }
      return result;
    } catch (error) {
      throw new ErrorResponse(error.message, error.statusCode);
    }
  };

/**
 * @description Gets all notes for a unique user
 * @param {Object} fields 
 */
  getNotesByUserId = async (fields) => {
    try {
      const result = await find(fields);
      if (result instanceof Error) {
        throw new ErrorResponse(error.message, 400);
      } else if (result === null || result.length === 0) {
        throw new ErrorResponse(`Empty`, 400);
      }
      return result;
    } catch (error) {
      throw new ErrorResponse(error.message, error.statusCode);
    }
  };
}

export default NoteService;
