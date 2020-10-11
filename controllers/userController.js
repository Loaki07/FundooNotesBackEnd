import UserService from '../services/userServices.js';
import { getSignedJwtToken, getResetPasswordToken } from '../utility/tokens.js';
import { validateUserRegistration } from '../middleware/validation.js';

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
   * @param {request} req
   * @param {response} res
   */
  registerUser = async (req, res) => {
    try {
      const { error } = await validateUserRegistration(req.body);
      if (error) {
        throw new Error(error);
      }
      const responseData = {};
      const result = await registerNewUser(req.body);
      responseData.success = true;
      responseData.message = 'Successfully Registered User!';
      this.#sendTokenResponse(result, 200, res, responseData);
    } catch (error) {
      const responseData = {};
      responseData.success = false;
      responseData.error = error.message;
      res.status(500).send(responseData);
    }
  };

  /**
   * @description LogIn User
   * @route POST /login
   * @param {request} req
   * @param {response} res
   */
  logInUser = async (req, res) => {
    try {
      const responseData = {};
      this.#validateUserLogIn(req.body);
      const result = await logInByUserName(req.body);
      responseData.success = true;
      responseData.message = 'Successfully Logged In!';
      this.#sendTokenResponse(result, 200, res, responseData);
    } catch (error) {
      const responseData = {};
      responseData.success = false;
      responseData.error = error.message;
      res.status(500).send(responseData);
    }
  };

  /**
   * @description Forgot Password
   * @route POST /forgotPassword
   * @param {request} req
   * @param {response} res
   * @param {next operation} next
   */
  forgotPassword = async (req, res, next) => {
    try {
      const responseData = {};
      const user = await forgotPasswordService(req);
      responseData.success = true;
      responseData.message = `Forgot Password\n\nEmail Sent to reset the Password`;
      responseData.data = user;
      res.status(200).send(responseData);
    } catch (error) {
      const responseData = {};
      responseData.success = false;
      responseData.error = error.message;
      res.status(500).send(responseData);
      // next(error)
    }
  };

  /**
   * @description Reset Password
   * @route PUT /fundooapp/resetpassword/:resettoken
   * @param {request} req
   * @param {response} res
   */
  resetPassword = async (req, res) => {
    try {
      const responseData = {};
      const result = await resetPasswordService(req);
      responseData.success = true;
      responseData.message = 'Password Reset Successfully!';
      this.#sendTokenResponse(result, 200, res, responseData);
    } catch (error) {
      const responseData = {};
      responseData.success = false;
      responseData.error = error.message;
      res.status(500).send(responseData);
    }
  };

  /**
   * @description Display all the users from the dataBase
   * @route GET /users
   * @param {request} req
   * @param {response} res
   */
  displayAllUsers = async (req, res) => {
    try {
      const responseData = {};
      const result = await findAllUsers();
      if (!result || result === null) {
        throw new Error('Database is Empty!');
      }
      responseData.success = true;
      responseData.message = 'Retreived Users From DataBase';
      responseData.data = result;
      res.status(200).send(responseData);
    } catch (error) {
      const responseData = {};
      responseData.success = false;
      responseData.error = error.message;
      res.status(500).send(responseData);
    }
  };

  getCurrentUserProfile = async (req, res, next) => {
    try {
      const responseData = {};
      const user = await findProtectedUser(req.user._id);
      responseData.success = true;
      responseData.message = 'Displaying details for the Current User';
      responseData.data = user;
      res.status(200).send(responseData);
    } catch (error) {
      const responseData = {};
      responseData.success = false;
      responseData.error = error.message;
      res.status(500).send(responseData);
    }
  };

  /**
   * @description Validating User Input for log In
   * @param {request.body} data
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
   * @param {User} user
   * @param {statusCode} statusCode
   * @param {response} res
   * @param {responseObject} responseObject
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
