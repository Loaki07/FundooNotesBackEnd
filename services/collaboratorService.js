import { CollaboratorModel } from '../models/collaborator.js';
import { NoteModel } from '../models/note.js';
import { UserModel } from '../models/user.js';
import { ErrorResponse } from '../utility/errorResponse.js';
const { createCollabrator, findCollabrator, findOneAndDelete } = new CollaboratorModel();
const { getAllUsers } = new UserModel();
const { updateNoteWithExistingData, updateNote, findOne } = new NoteModel();

class CollaboratorService {
  /**
   * @description Gets all the regiserted user emails
   * @returns An Array with all the emailids
   */
  findAllEmailIds = async () => {
    let emailIdArray = [];
    const getAllRegisteredUsers = await getAllUsers();
    getAllRegisteredUsers.forEach((user) => {
      emailIdArray.push(user.emailId);
    });
    if (!getAllRegisteredUsers || getAllRegisteredUsers.length === 0) {
      throw new ErrorResponse('No Entries', 400);
    }
    return emailIdArray;
  };

  /**
   * @description Create new collobarator
   * @returns Created Collaborator object
   */
  createNewCollaborator = async (data) => {
    const findNote = await this.#getNote({
      _id: data.noteId,
    });

    const collaboratorObject = {
      collaboratorEmail: data.collaboratorEmail,
    };

    findNote.collaborators.forEach((collaborator) => {
      if (collaborator.collaboratorEmail === data.collabratorEmail) {
        throw new ErrorResponse('Collaborator already present', 400);
      }
    });

    const ceatedCollaborator = await createCollabrator(data);
    return await this.addCollaboratorToNote(ceatedCollaborator);
  };

  /**
   * @description Adds the Collaborator to the node
   * @param {Object} collaboratorObject
   */
  addCollaboratorToNote = async (collaboratorObject) => {
    const updatedToNote = await updateNoteWithExistingData(
      { _id: collaboratorObject.noteId },
      {
        collaborators: collaboratorObject,
      }
    );
    if (updatedToNote instanceof Error) {
      throw new ErrorResponse(error.message, 400);
    }
    return updatedToNote;
  };

  /**
   * @description Deletes Collaborator in db and from note
   * @param {Object} collaboratorObject
   */
  deleteCollaboratorFromNote = async (collaboratorObject) => {
    const findNote = await this.#getNote({
      _id: collaboratorObject.noteId,
    });

    findNote.collaborators.forEach((collabrator, index, object) => {
      if (collabrator._id == collaboratorObject.collaboratorId) {
        return object.splice(index, 1);
      }
    });

    await this.deleteCollaboratorInDb(collaboratorObject);
    const result = await this.#updateNote(findNote._id, findNote.collaborators);
    return result;
  };

  /**
   * @description Function to delete the Collaborator fron db
   * @param {Object} collaboratorObject
   */
  deleteCollaboratorInDb = async (collaboratorObject) => {
    return await findOneAndDelete({
      _id: collaboratorObject.collaboratorId,
    });
  };

  /**
   * Gets all colloaborators in db
   */
  getAllCollaborators = async () => {
    return await findCollabrator();
  };

  /**
   * @description Function to get note
   * @param {Object} data
   */
  #getNote = async (data) => {
    const result = await findOne(data);

    if (!result) {
      throw new ErrorResponse('Could not be Found', 404);
    }
    return result;
  };

  /**
   * @description Function to update the collaborators onto the note
   * @param {ObjectID} id
   * @param {Object} data
   */
  #updateNote = async (id, data) => {
    const result = await updateNote(
      { _id: id },
      {
        collaborators: data,
      }
    );
    if (result instanceof Error) {
      throw new ErrorResponse(error.message, 400);
    }
    return result;
  };
}

export default CollaboratorService;
