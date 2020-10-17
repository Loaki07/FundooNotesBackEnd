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
  createNewNote = async (data, next) => {
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

  findAllNotes = async (req, res) => {
    try {
      return await getAllNotes();
    } catch (error) {
      throw new ErrorResponse(error.message, error.statusCode);
    }
  };

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
