import mongoose from 'mongoose';
const { Schema } = mongoose;

// Note Schema
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [3, 'A Minimum of 3 characters is required'],
      required: true,
    },
    description: {
      type: String,
    },
    color: {
      type: String,
      enum: [
        'yellow',
        'orange',
        'red',
        'green',
        'teal',
        'purple',
        'pink',
        'brown',
        'grey',
      ],
      default: 'yellow',
    },
    imageUrl: {
      type: String,
    },
    useCheckBox: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    remaindMe: {
      type: String,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    delete: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    labels: {
      type: [Object],
    },
    collaborators: {
      type: [Object],
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const Note = mongoose.model('Note', noteSchema);

class NoteModel {
  // Creates a note and saves it in db
  createNote = async (data) => {
    const {
      title,
      description,
      color,
      image,
      useCheckBox,
      isPinned,
      remaindMe,
      isArchived,
      userId,
      labels,
      collaborators,
    } = data;
    return await Note.create({
      title,
      description,
      color,
      image,
      useCheckBox,
      isPinned,
      remaindMe,
      isArchived,
      userId,
      labels,
      collaborators,
    });
  };

  // Mongoose Method to find all notes
  getAllNotes = async () => {
    return Note.find();
  };

  // Mongoose Method to save note
  saveNote = async (note) => {
    return note.save;
  };

  // Updates the note by replacing the old data with the new data
  updateNote = async (id, updatedNoteObject) => {
    return Note.findOneAndUpdate(
      id,
      {
        $set: updatedNoteObject,
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
  };

  // Updates not by adding on to the existing data
  updateNoteWithExistingData = async (id, updatedNoteObject) => {
    return Note.findOneAndUpdate(
      id,
      {
        $push: updatedNoteObject,
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
  };

  // Mongoose method to find note by id and delete
  deleteNote = async (id) => {
    return Note.findByIdAndDelete(id);
  };

  // Mongoose method to find one note using schema fields
  findOne = async (fields) => {
    return Note.findOne(fields);
  };

  // Mongoose method to find notes using schema fields
  find = async (fields) => {
    return Note.find(fields);
  };
}

export { NoteModel };
