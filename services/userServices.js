import User from '../models/userSchema.js';
import bcrypt from 'bcrypt';
const saltRounds = 10;

const registerNewUser = (data, callback) => {
  bcrypt.hash(data.password, saltRounds, function (err, hashedPassword) {
    // Store hash in your password DB.
    const newUser = new User({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    });

    newUser.save((err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    });
  });
};

const logIn = (data, callback) => {
  const { firstName, lastName, email, password } = data;

  User.findOne({ email: email }, (err, foundUser) => {
    if (err) {
      callback(err);
    } else {
      if (foundUser) {
        console.log('FoundUser', foundUser);
        // Load hash from your password DB.
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result == true) {
            callback(null, result);
          }
        });
      } else {
        callback();
      }
    }
  });
};

const findUserByID = (data, callback) => {
  User.findById(data.params.id, (err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

const updateUserDetails = (data, callback) => {
  const fieldsToUpdate = {
    firstName: data.body.firstName,
    lastName: data.body.lastName,
    email: data.body.email,
  };

  User.findByIdAndUpdate(
    data.params.id,
    fieldsToUpdate,
    {
      new: true,
      useFindAndModify: false,
      runValidators: true,
    },
    (err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    }
  );
};

const deleteUserByID = (data, callback) => {
  User.deleteOne({ _id: data.params.id }, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

const findAllUsers = (callback) => {
  User.find((err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

export {
  registerNewUser,
  logIn,
  updateUserDetails,
  findUserByID,
  deleteUserByID,
  findAllUsers,
};
