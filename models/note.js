import mongoose from 'mongoose';

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
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model('Note', noteSchema);

class NoteModel {
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
    });
  };

  getAllNotes = async () => {
    return Note.find();
  };

  saveNote = async (note) => {
    return note.save;
  };

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

  deleteNote = async (id) => {
    return Note.findByIdAndDelete(id);
  };

  findOne = async (fields) => {
    return Note.findOne(fields);
  };
}

export { NoteModel };
