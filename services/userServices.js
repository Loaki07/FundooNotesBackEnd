import { UserModel } from '../models/userSchema.js';
import { getResetPasswordToken } from '../utility/tokens.js';
import crypto from 'crypto';
import sendEmail from '../utility/sendEmail.js';
const {
  createUser,
  findUserAndVerify,
  getAllUsers,
  getProtectedUser,
  findUserByEmail,
  SaveUser,
  clearResetFields,
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

  forgotPasswordService = async (requestData) => {
    try {
      const foundUser = await findUserByEmail(requestData.body.email);
      if (!foundUser) {
        throw new Error(`User with email '${requestData.body.email}' does not exist`);
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

      // Create reset url
      const resetUrl = `${requestData.protocol}://${requestData.get(
        'host'
      )}/fundooapp/resetpassword/${resetToken}`;

      const message = `Please click on the reset link provided below to reset the password \n\nLink expires in 10 minutes \n\nReset Link: ${resetUrl}`;

      await sendEmail({
        email: requestData.body.email,
        subject: 'FundooApp Password Reset Link',
        message,
      });

      return foundUser;
    } catch (error) {
      clearResetFields(requestData);
      await SaveUser(requestData);
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
