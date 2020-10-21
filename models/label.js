import mongoose from 'mongoose';
const { Schema } = mongoose;

// Label Schema
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
  // Creating a label
  createLabel = async (data) => {
    const { labelName, noteId, userId } = data;
    return Label.create({
      labelName,
      noteId,
      userId,
    });
  };

  // Find label using the schema fields
  findLabel = async (fields) => {
    return Label.find(fields);
  };

  // Save label
  saveLabel = async (label) => {
    return label.save;
  };

  // Updates Label in db with the new data provided
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

  // Finding using any of the schema fields
  findOneLabel = async (fields) => {
    return Label.findOne(fields);
  };

  // Delele by label id
  deleteLabel = async (id) => {
    return Label.findByIdAndDelete(id);
  };

  // Delete by any of the label schema fields
  findOneAndDelete = async (fields) => {
    return Label.findOneAndDelete(fields);
  };
}

export { LabelModel };
