import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Schema
 */
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: [3, 'A Minimum of 3 characters is required'],
      required: true,
    },
    lastName: {
      type: String,
      minlength: [3, 'A Minimum of 3 characters is required'],
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      minlength: [6, 'A Minimum of 3 characters is required'],
      required: true,
      select: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
  const saltRounds = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

class UserModel {
  createUser = async (data) => {
    const { firstName, lastName, emailId, password, isEmailVerified } = data;
    return User.create({
      firstName,
      lastName,
      emailId,
      password,
      isEmailVerified,
    });
  };

  getAllUsers = async () => {
    return User.find();
  };

  getProtectedUser = async (id) => {
    return User.findById(id);
  };

  findOne = async (fields) => {
    return User.findOne(fields);
  };

  saveUser = async (user) => {
    return user.save;
  };

  updateUser = async (id, updatedUserObject) => {
    return User.findOneAndUpdate(
      id,
      {
        $set: updatedUserObject,
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
  };

  saveUserWithoutValidation = async (user) => {
    return user.save({ validateBeforeSave: false });
  };

  clearResetFields = (user) => {
    (user.resetPasswordToken = undefined), (user.resetPasswordExpire = undefined);
  };
}

export { UserModel, User };
