import { UserModel } from '../models/userSchema.js';
import { getResetPasswordToken } from '../utility/utility.js';
import crypto from 'crypto';
const {
  createUser,
  findUserAndVerify,
  getAllUsers,
  getProtectedUser,
  findUserByEmail,
  SaveUser,
} = new UserModel();

class UserService {
  registerNewUser = async (data) => {
    try {
      const isUserPresent = await findUserByEmail(data.email);
      if (isUserPresent) {
        throw new Error(`User with email '${data.email}' already exists!`);
      }
      return await createUser(data);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  logInByUserName = async (data) => {
    try {
      const foundUser = await findUserAndVerify(data);
      return foundUser;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  forgotPasswordService = async (email) => {
    try {
      const foundUser = await findUserByEmail(email);
      if (!foundUser) {
        throw new Error(`User with email '${email}' does not exist`);
      }

      const resetToken = getResetPasswordToken();

      // Hash token and set to resetPasswordToken field
      foundUser.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Set Expire
      foundUser.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
      await SaveUser(foundUser);
      return foundUser;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  findAllUsers = async () => {
    return await getAllUsers();
  };

  findProtectedUser = async (id) => {
    return await getProtectedUser(id);
  };
}

export default UserService;
