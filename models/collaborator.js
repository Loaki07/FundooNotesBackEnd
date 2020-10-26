import mongoose from 'mongoose';
const { Schema } = mongoose;

// Collabrator Schema
const collaboratorSchema = new mongoose.Schema({
  collaboratorEmail: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email',
    ],
  },
  noteId: {
    type: Schema.Types.ObjectId,
    ref: 'Note',
  },
});

const Collaborator = mongoose.model('Collaborator', collaboratorSchema);

class CollaboratorModel {
  // Creating a Collabrator
  createCollabrator = async (data) => {
    const { collaboratorEmail, noteId } = data;
    return Collaborator.create({
      collaboratorEmail,
      noteId,
    });
  };

  // Find Collabrator using the schema fields
  findCollabrator = async (fields) => {
    return Collaborator.find(fields);
  };

  // Delete by any of the Collabrator schema fields
  findOneAndDelete = async (fields) => {
    return Collaborator.findOneAndDelete(fields);
  };
}

export { CollaboratorModel };
