import { LabelModel } from '../models/label.js';
import { ErrorResponse } from '../utility/errorResponse.js';
import { NoteModel } from '../models/note.js';
const { findOne, updateNoteWithExistingData } = new NoteModel();
const {
  createLabel,
  findLabel,
  saveLabel,
  updateLabel,
  findOneLabel,
  deleteLabel,
} = new LabelModel();

class LabelService {
  createNewLabel = async (data) => {
    const getNote = await findOne({
      title: data.title,
    });

    if (!getNote) {
      throw new ErrorResponse('Could not be Found', 404);
    }

    const labelObject = {
      labelName: data.labelName,
      noteId: getNote._id,
      userId: data.userId,
    };

    const isLabelPresent = await findOneLabel(labelObject);
    if (isLabelPresent) {
      throw new ErrorResponse('Already Exists', 400);
    }
    const label = await createLabel(labelObject);
    const result = await this.addLabelToNote(label);
    return result;
  };

  addLabelToNote = async (labelObject) => {
    const updatedToNote = await updateNoteWithExistingData(
      { _id: labelObject.noteId },
      {
        labels: labelObject,
      }
    );
    if (updatedToNote instanceof Error) {
      throw new ErrorResponse(error.message, 400);
    }
    return updatedToNote;
  };
}

export default LabelService;
