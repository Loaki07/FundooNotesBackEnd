import UserService from '../services/userServices.js';
import { getSignedJwtToken, getResetPasswordToken } from '../utility/tokens.js';
import validation from '../middleware/validation.js';
import logger from '../config/logger.js';
const { validateUserRegistration } = new validation();

const {
  registerNewUser,
  logInByUserName,
  findAllUsers,
  findProtectedUser,
  forgotPasswordService,
  resetPasswordService,
} = new UserService();

class UserController {
  /**
   * @description Register User
   * @route POST /register
   * @param {object} req
   * @param {object} res
   */
  registerUser = async (req, res) => {
    const responseData = {};
    try {
      const { error } = await validateUserRegistration(req.body);
      if (error) {
        throw new Error(error);
      }
      const result = await registerNewUser(req.body);
      responseData.success = true;
      responseData.message = 'Successfully Registered User!';
      logger.info(responseData.message);
      this.#sendTokenResponse(result, 200, res, responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(500).send(responseData);
    }
  };

  /**
   * @description LogIn User
   * @route POST /login
   * @param {object} req
   * @param {object} res
   */
  logInUser = async (req, res) => {
    const responseData = {};
    try {
      this.#validateUserLogIn(req.body);
      const result = await logInByUserName(req.body);
      responseData.success = true;
      responseData.message = 'Successfully Logged In!';
      logger.info(responseData.message);
      this.#sendTokenResponse(result, 200, res, responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(500).send(responseData);
    }
  };

  /**
   * @description Forgot Password
   * @route POST /forgotPassword
   * @param {object} req
   * @param {object} res
   * @param {function} next
   */
  forgotPassword = async (req, res, next) => {
    const responseData = {};
    try {
      const user = await forgotPasswordService(req);
      responseData.success = true;
      responseData.message = `Forgot Password\n\nEmail Sent to reset the Password`;
      responseData.data = user;
      logger.info(responseData.message);
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(500).send(responseData);
      // next(error)
    }
  };

  /**
   * @description Reset Password
   * @route PUT /fundooapp/resetpassword/:resettoken
   * @param {object} req
   * @param {object} res
   */
  resetPassword = async (req, res) => {
    const responseData = {};
    try {
      const result = await resetPasswordService(req);
      responseData.success = true;
      responseData.message = 'Password Reset Successfully!';
      logger.info(responseData.message);
      this.#sendTokenResponse(result, 200, res, responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(500).send(responseData);
    }
  };

  /**
   * @description Display all the users from the dataBase
   * @route GET /users
   * @param {object} req
   * @param {object} res
   */
  displayAllUsers = async (req, res) => {
    const responseData = {};
    try {
      const result = await findAllUsers();
      if (!result || result === null) {
        throw new Error('Database is Empty!');
      }
      responseData.success = true;
      responseData.message = 'Retreived Users From DataBase';
      responseData.data = result;
      logger.info(responseData.message);
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(500).send(responseData);
    }
  };

  getCurrentUserProfile = async (req, res, next) => {
    const responseData = {};
    try {
      const user = await findProtectedUser(req.user._id);
      responseData.success = true;
      responseData.message = 'Displaying details for the Current User';
      responseData.data = user;
      logger.info(responseData.message);
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.message = error.message;
      logger.error(error.message);
      res.status(500).send(responseData);
    }
  };

  /**
   * @description Validating User Input for log In
   * @param {object} data
   */
  #validateUserLogIn = (data) => {
    const { email, password } = data;
    if (!email && !password) {
      throw new Error('Please provide an email and password!');
    } else if (!password) {
      throw new Error('Password cannot be empty!');
    } else if (!email) {
      throw new Error('Email cannot be empty!');
    }
  };

  /**
   * @description Store the JWT Token in a cookie and send as response
   * @param {object} user
   * @param {object} statusCode
   * @param {object} res
   * @param {object} responseObject
   */
  #sendTokenResponse = (user, statusCode, res, responseObject) => {
    const token = getSignedJwtToken(user._id);

    const options = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE),
      httpOnly: true,
      secure: true,
    };
    responseObject.token = token;
    res.status(statusCode).cookie('token', token, options).send(responseObject);
  };
}

export default UserController;
