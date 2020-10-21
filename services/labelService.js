import { LabelModel } from '../models/label.js';
import { ErrorResponse } from '../utility/errorResponse.js';
import { NoteModel } from '../models/note.js';
const { findOne, updateNoteWithExistingData, updateNote } = new NoteModel();
const {
  createLabel,
  findLabel,
  saveLabel,
  updateLabel,
  findOneLabel,
  deleteLabel,
  findOneAndDelete,
} = new LabelModel();

class LabelService {
  createNewLabel = async (data) => {
    const findNote = await this.#getNote(data);

    const labelObject = {
      labelName: data.labelName,
      noteId: findNote._id,
      userId: data.userId,
    };

    const isLabelPresent = await findOneLabel(labelObject);

    if (isLabelPresent) {
      throw new ErrorResponse('Already Exists', 400);
    }
    const label = await createLabel(labelObject);
    return await this.addLabelToNote(label);
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

  deleteLabelFromNote = async (labelObject) => {
    const findNote = await this.#getNote(labelObject);

    findNote.labels.forEach((label, index, object) => {
      if (label.labelName === labelObject.labelName) {
        return object.splice(index, 1);
      }
    });
    await this.deleteLabelInDb(labelObject);
    await this.#updateNote(findNote._id, findNote.labels);
    return true;
  };

  deleteLabelInDb = async (labelObject) => {
    return await findOneAndDelete({ labelName: labelObject.labelName });
  };

  getLabels = async () => {
    return findLabel();
  };

  #getNote = async (data) => {
    const result = await findOne({
      title: data.title,
    });

    if (!result) {
      throw new ErrorResponse('Could not be Found', 404);
    }
    return result;
  };

  #updateNote = async (id, data) => {
    const result = await updateNote(
      { _id: id },
      {
        labels: data,
      }
    );
    if (result instanceof Error) {
      throw new ErrorResponse(error.message, 400);
    }
    return result;
  };
}

export default LabelService;
