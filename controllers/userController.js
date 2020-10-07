import UserService from '../services/userServices.js';
import { getSignedJwtToken } from '../utility/utility.js';

const { registerNewUser, logInByUserName, findAllUsers } = new UserService();

class UserController {
  /**
   * Register User
   * @param {request} req
   * @param {response} res
   */
  registerUser = async (req, res) => {
    const responseData = {};
    try {
      const result = await registerNewUser(req.body);

      responseData.success = true;
      responseData.message = 'Successfully Registered User!';
      responseData.token = getSignedJwtToken(result._id);
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.error = error;
      res.status(500).send(responseData);
    }
  };

  /**
   * LogIn User
   * @param {request} req
   * @param {response} res
   */
  logInUser = async (req, res) => {
    const responseData = {};
    try {
      this.#validateUserLogIn(req.body);
      const result = await logInByUserName(req.body);
      responseData.success = true;
      responseData.message = 'Successfully Logged In!';
      responseData.token = getSignedJwtToken(result._id);
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.error = error.message;
      res.status(500).send(responseData);
    }
  };

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

  displayAllUsers = async (req, res) => {
    const responseData = {};
    try {
      const result = await findAllUsers();
      if (!result || result === null) {
        throw new Error('Database is Empty!');
      }
      responseData.message = 'Retreived Users From DataBase';
      responseData.data = result;
      res.status(200).send(responseData);
    } catch (error) {
      responseData.success = false;
      responseData.error = error.message;
      res.status(500).send(responseData);
    }
  };
}

export default UserController;
