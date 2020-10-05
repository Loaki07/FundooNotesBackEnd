import {
  registerNewUser,
  logIn,
  updateUserDetails,
  findUserByID,
  deleteUserByID,
  findAllUsers,
} from '../services/userServices.js';

const registerUser = (req, res) => {
  registerNewUser(req.body, (err, resultData) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send('Successfully registered new user in DataBase!');
    }
  });
};

const logInUser = (req, res) => {
  logIn(req.body, (err, resultData) => {
    if (err) {
      res.status(500).send(err);
    } else if (resultData === null || resultData === undefined) {
      res.status(404).send(`User with email ${req.body.email} Not Found!`);
    } else {
      res.status(200).send('Successfully Logged In!');
    }
  });
};

const userById = (req, res) => {
  findUserByID(req, (err, resultData) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(resultData);
  });
};

const updateUser = (req, res) => {
  updateUserDetails(req, (err, resultData) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(resultData);
  });
};

const deleteUser = (req, res) => {
  deleteUserByID(req, (err, resultData) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send('Successfully Deleted');
  });
};

const displayAllUsers = (req, res) => {
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

export { registerUser, logInUser, updateUser, userById, deleteUser, displayAllUsers };
