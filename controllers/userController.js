import UserService from '../services/userServices.js';
import { getSignedJwtToken } from '../utility/utility.js';

const {
  registerNewUser,
  logInByUserName,
  updateUserDetails,
  findUserByID,
  deleteUserByID,
  findAllUsers,
} = new UserService();

class UserController {
  /**
   * Register User
   * @param {request} req
   * @param {response} res
   */
  registerUser = (req, res) => {
    registerNewUser(req.body, (err, resultData) => {
      if (err) {
        res.status(500).send(err);
      } else {
        const token = getSignedJwtToken(resultData._id);
        res.status(200).send(token);
      }
    });
  };

  /**
   * LogIn User
   * @param {request} req
   * @param {response} res
   */
  logInUser = (req, res) => {
    logInByUserName(req.body, (err, resultData) => {
      if (err) {
        res.status(500).send(err);
      } else if (resultData === null || resultData === undefined) {
        res.status(404).send(`User with email ${req.body.email} Not Found!`);
      } else {
        res.status(200).send('Successfully Logged In!');
      }
    });
  };

  displayAllUsers = (req, res) => {
    findAllUsers((err, resultData) => {
      if (err) {
        res.status(500).send(err);
      } else if (resultData === null || resultData === undefined) {
        res.status(200).send('Database is Empty!');
      } else {
        res.status(200).send(resultData);
      }
    });
  };
}

export default UserController;
