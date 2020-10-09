import { UserModel } from '../models/userSchema.js';
import { getResetPasswordToken } from '../utility/tokens.js';
import crypto from 'crypto';
import sendEmail from '../utility/sendEmail.js';
const {
  createUser,
  getAllUsers,
  getProtectedUser,
  findOne,
  SaveUser,
  clearResetFields,
  saveUserWithoutValidation,
} = new UserModel();

class UserService {
  registerNewUser = async (data) => {
    try {
      const isUserPresent = await findOne({
        email: data.email,
      });
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
      const { email, password } = data;

      const foundUser = await findOne({ email });
      if (foundUser === null || !foundUser) {
        throw new Error(`User with email ${email}, Not Found!`);
      }
      // Check if password matches
      const isMatch = await foundUser.matchPassword(password);
      if (!isMatch) {
        throw new Error(`Incorrect Password`);
      }
      return foundUser;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  /**
   * @description When Forgotten Password sends Email to Reset Password with the reset token
   * @param {requestData} requestData
   * @returns User with resetToken with expire time
   */
  forgotPasswordService = async (requestData) => {
    try {
      const foundUser = await findOne({
        email: requestData.body.email,
      });
      if (!foundUser) {
        throw new Error(`User with email '${requestData.body.email}' does not exist`);
      }

      const resetToken = getResetPasswordToken();

      // Hash token and set to resetPasswordToken field
      foundUser.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      // Set Expire Time
      foundUser.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
      await saveUserWithoutValidation(foundUser);

      // Create reset url
      const resetUrl = `${requestData.protocol}://${requestData.get(
        'host'
      )}/fundooapp/resetpassword/${resetToken}`;
      const message = `Please click on the reset link provided below to reset the password \n\nLink expires in 10 minutes \n\nReset Link: ${resetUrl}`;

      // Send the reset link to the user
      await sendEmail({
        email: requestData.body.email,
        subject: 'FundooApp Password Reset Link',
        message,
      });

      return foundUser;
    } catch (error) {
      clearResetFields(requestData.body);
      await SaveUser(requestData.body);
      throw new Error(error.message);
    }
  };

  resetPasswordService = async (requestData) => {
    try {
      // Get hashed password
      const resetPasswordToken = crypto
        .createHash('sha256')
        .update(requestData.params.resettoken)
        .digest('hex')
        .toString();

      const user = await findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
      });

      if (!user) {
        throw new Error('Invalid Token');
      }

      // Set new Password
      user.password = requestData.body.password;
      clearResetFields(user);
      await saveUserWithoutValidation(user);

      return user;
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
