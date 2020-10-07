import User from '../models/userSchema.js';
import UserModel from '../models/userSchema.js';
const { register, logIn, getAllUsers } = new UserModel();

class UserService {
  registerNewUser = async (data, callback) => {
    try {
      return await register(data);
    } catch (error) {
      return error
    }
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
    getAllUsers((err, resultData) => {
      if (err) {
        callback(err);
      } else {
        callback(resultData);
      }
    });
  };
}

export default UserService;
