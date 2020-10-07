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

  displayAllUsers = (req, res) => {
    const responseData = {};
    findAllUsers((err, resultData) => {
      if (err) {
        responseData.success = false;
        responseData.message = 'Some Error';
        responseData.error = err;
        res.status(500).send(responseData);
      } else if (resultData === null || resultData === undefined) {
        responseData.message = 'Database is Empty!';
        res.status(200).send(responseData);
      } else {
        responseData.message = 'User Data From DataBase';
        // responseData.data = resultData;
        res.status(200).send(resultData);
      }
    });
  };
}

export default UserController;
