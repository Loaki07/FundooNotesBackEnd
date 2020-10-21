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
  /**
   * @description Finds the note id from the title and adds it to the label object, then a new label is created in db and added to note
   * @param {Object} data
   */
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

  /**
   * @description Adds the label to the node
   * @param {Object} labelObject
   */
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

  /**
   * @description Deletes label in db and from note
   * @param {Object} labelObject
   */
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

  /**
   * @description Function to delete the label fron db
   * @param {Object} labelObject
   */
  deleteLabelInDb = async (labelObject) => {
    return await findOneAndDelete({ labelName: labelObject.labelName });
  };

  /**
   * Gets all the labels from the db
   */
  getLabels = async () => {
    return findLabel();
  };

  /**
   * @description Function to get note with the title
   * @param {Object} data
   */
  #getNote = async (data) => {
    const result = await findOne({
      title: data.title,
    });

    if (!result) {
      throw new ErrorResponse('Could not be Found', 404);
    }
    return result;
  };

  /**
   * @description Function to update the labels onto the note
   * @param {ObjectID} id
   * @param {Object} data
   */
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
