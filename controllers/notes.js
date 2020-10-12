import NoteService from '../services/noteService.js';
import validation from '../middleware/validation.js';
const { validateNote } = new validation();
import ErrorResponse from '../utility/errorResponse.js';
const { createNewNote, findAllNotes } = new NoteService();

class NoteController {
  createNote = async (req, res) => {
    try {
      const { error } = await validateNote(req.body);
      if (error) {
        throw new ErrorResponse(`${error.message}`, 402);
      }
      const responseData = {};
      const result = await createNewNote(req.body);
      responseData.success = true;
      responseData.message = 'Successfully Created Note!';
      responseData.data = result;
      res.status(200).send(responseData);
    } catch (error) {
      const responseData = {};
      responseData.success = false;
      responseData.error = error.message;
      res.status(error.statusCode || 500).send(responseData);
    }
  };

  getNotes = async (req, res) => {
    try {
      const responseData = {};
      const result = await findAllNotes();
      console.log(result);
      if (!result || result === null) {
        throw new ErrorResponse('There are no Notes to display', 404);
      }
      responseData.success = true;
      responseData.message = 'Displaying all Notes';
      responseData.data = result;
      res.status(200).send(responseData);
    } catch (error) {
      const responseData = {};
      responseData.success = false;
      responseData.error = error.message;
      res.status(error.statusCode || 500).send(responseData);
    }
  };

  updateSingleNote = async (req, res) => {
    try {
    } catch (error) {
      const responseData = {};
      responseData.success = false;
      responseData.error = error.message;
      res.status(error.statusCode || 500).send(responseData);
    }
  };
}

export default NoteController;
