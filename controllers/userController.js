import UserService from '../services/userServices.js';
import { getSignedJwtToken } from '../utility/utility.js';

const { registerNewUser, logInByUserName, findAllUsers } = new UserService();

class UserController {
  /**
   * @description Register User
   * @route POST /register
   * @param {request} req
   * @param {response} res
   */
  registerUser = async (req, res) => {
    try {
      const responseData = {};
      const result = await registerNewUser(req.body);
      responseData.success = true;
      responseData.message = 'Successfully Registered User!';
      this.#sendTokenResponse(result, 200, res, responseData);
    } catch (error) {
      const responseData = {};
      responseData.success = false;
      responseData.error = error;
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
