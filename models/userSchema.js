import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const saltRounds = 10;

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
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const saltRounds = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, saltRounds);
});

const User = mongoose.model('User', userSchema);

class UserModel {
  register = async (data) => {
    try {
      const { firstName, lastName, email, password } = data;
      return User.create({
        firstName,
        lastName,
        email,
        password,
      });
    } catch (error) {
      return error;
    }
  };

  logIn = (data, callback) => {
    const { email, password } = data;

    User.findOne({ email: email }, (err, foundUser) => {
      if (err) {
        callback(err);
      } else {
        if (foundUser) {
          // Load hash from your password DB.
          bcrypt.compare(password, foundUser.password, function (err, result) {
            if (result == true) {
              callback(null, result);
            } else {
              callback({ success: false, message: 'Incorrect Password' });
            }
          });
        } else {
          callback({ success: false, message: `User with email ${email}, Not Found!` });
        }
      }
    });
  };

  getAllUsers = (callback) => {
    User.find((err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    });
  };
}

export default UserModel;
