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
}

export default NoteService;
