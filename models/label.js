import mongoose from 'mongoose';
const { Schema } = mongoose;

const labelSchema = new mongoose.Schema(
  {
    labelName: {
      type: String,
      unique: true,
    },
    noteId: {
      type: Schema.Types.ObjectId,
      ref: 'Note',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const Label = mongoose.model('Label', labelSchema);

class LabelModel {
  createLabel = async (data) => {
    const { labelName, noteId, userId } = data;
    return Label.create({
      labelName,
      noteId,
      userId,
    });
  };

  findLabel = async (fields) => {
    return Label.find(fields);
  };

  saveLabel = async (label) => {
    return label.save;
  };

  updateLabel = async (id, updateLabelObject) => {
    return Label.findOneAndUpdate(
      id,
      {
        $set: updateLabelObject,
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
  };

  findOneLabel = async (fields) => {
    return Label.findOne(fields);
  };

  deleteLabel = async (id) => {
    return Label.findByIdAndDelete(id);
  };

  findOneAndDelete = async (fields) => {
    return Label.findOneAndDelete(fields);
  };
}

export { LabelModel };
