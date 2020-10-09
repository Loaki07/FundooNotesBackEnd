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
    email: {
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
      minlength: [3, 'A Minimum of 3 characters is required'],
      required: true,
      select: true,
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
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

class UserModel {
  createUser = async (data) => {
    const { firstName, lastName, email, password } = data;
    return User.create({
      firstName,
      lastName,
      email,
      password,
    });
  };

  findUserAndVerify = async (data) => {
    const { email, password } = data;
    try {
      const foundUser = await User.findOne({ email: email });

      if (foundUser === null || !foundUser) {
        throw new Error(`User with email ${email}, Not Found!`);
      }

      // Check if password matches
      const isMatch = await foundUser.matchPassword(password);
      if (isMatch) {
        return foundUser;
      } else {
        throw new Error(`Incorrect Password`);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getAllUsers = async () => {
    return await User.find();
  };

  getProtectedUser = async (id) => {
    return await User.findById(id);
  };

  findUserByEmail = async (email) => {
    return await User.findOne({ email });
  };

  SaveUser = async (user) => {
    return await user.save;
  };

  clearResetFields = async (user) => {
    (user.resetPasswordToken = undefined), (user.resetPasswordExpire = undefined);
  };
}

export { UserModel, User };
