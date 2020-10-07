import User from '../models/userSchema.js';
import UserModel from '../models/userSchema.js';
const { register, logIn, getAllUsers } = new UserModel();

class UserService {
  registerNewUser = (data, callback) => {
    register(data, (err, resultData) => {
      if (err) {
        callback(err);
      } else {
        callback(null, resultData);
      }
    });
  };

  logInByUserName = (data, callback) => {
    logIn(data, (err, resultData) => {
      if (err) {
        callback(err);
      } else {
        callback(null, resultData);
      }
    });
  };

  findAllUsers = (callback) => {
    getAllUsers((err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(result);
      }
    });
  };
}

export default UserService;
