import UserService from '../services/userServices.js';
import { getSignedJwtToken } from '../utility/utility.js';

const { registerNewUser, logInByUserName, findAllUsers } = new UserService();

class UserController {
  // Response Array
  #responseData = {};

  /**
   * Register User
   * @param {request} req
   * @param {response} res
   */
  registerUser = async (req, res) => {
    try {
      const result = await registerNewUser(req.body);

      this.#responseData.success = true;
      this.#responseData.message = 'Successfully Registered User!';
      this.#responseData.token = getSignedJwtToken(result._id);
      res.status(200).send(this.#responseData);
    } catch (error) {
      this.#responseData.success = false;
      this.#responseData.error = error;
      res.status(500).send(this.#responseData);
    }
  };

  /**
   * LogIn User
   * @param {request} req
   * @param {response} res
   */
  logInUser = (req, res) => {
    const { email, password } = req.body;

    if (!email && !password) {
      return res.status(400).send({
        success: false,
        message: 'Please provide an email and password!',
      });
    } else if (!password) {
      return res.status(400).send({
        success: false,
        message: 'Password cannot be empty!',
      });
    } else if (!email) {
      return res.status(400).send({
        success: false,
        message: 'Email cannot be empty!',
      });
    }

    logInByUserName(req.body, (err, resultData) => {
      if (err) {
        res.status(500).send(err);
      } else {
        this.#responseData.success = true;
        this.#responseData.message = 'Successfully Logged In!';
        this.#responseData.token = getSignedJwtToken(resultData._id);
        res.status(200).send(this.#responseData);
      }
    });
  };

  displayAllUsers = (req, res) => {
    findAllUsers((err, resultData) => {
      if (err) {
        this.#responseData.success = false;
        this.#responseData.message = 'Some Error';
        this.#responseData.error = err;
        res.status(500).send(this.#responseData);
      } else if (resultData === null || resultData === undefined) {
        this.#responseData.message = 'Database is Empty!';
        res.status(200).send(this.#responseData);
      } else {
        this.#responseData.message = 'User Data From DataBase';
        // this.#responseData.data = resultData;
        res.status(200).send(resultData);
      }
    });
  };
}

export default UserController;
