import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: [3, 'A Minimum of 3 characters is required'],
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model('Note', noteSchema);

class NoteModel {
  createNote = async (data) => {
    const { title, description } = data;
    return await Note.create({
      title,
      description,
    });
  };

  getAllNotes = async () => {
    return await Note.find();
  };

  saveNote = async (note) => {
    return await note.save;
  };

  updateNote = async (id) => {
    return await Note.findByIdAndUpdate(id, { new: true, useFindAndModify: false });
  };

  deleteNote = async (id) => {
    return await Note.findByIdAndDelete(id);
  };
}

export { NoteModel };