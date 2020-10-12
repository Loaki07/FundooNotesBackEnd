import { NoteModel } from '../models/note.js';
import ErrorResponse from '../utility/errorResponse.js';
const {
  createNote,
  getAllNotes,
  saveNote,
  updateNote,
  deleteNote,
  findOne,
} = new NoteModel();

class NoteService {
  createNewNote = async (data, next) => {
    try {
      const isNotePresent = await findOne({
        title: data.title,
      });
      if (isNotePresent) {
        throw new ErrorResponse(`Note with title '${data.title}' already exists!`, 400);
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
      console.log(id, data);
      const result = await updateNote(id, data);
      if (result instanceof Error) {
        throw new ErrorResponse(error.message, 400);
      }
      return result;
    } catch (error) {
      throw new ErrorResponse(error.message, error.statusCode);
    }
  };

  findNoteByDb = async (id) => {
    try {
      const result = await findOne({ _id: id });
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
  }
}

export default NoteService;
