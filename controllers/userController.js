import { registerNewUser, logIn } from '../services/userServices.js';

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

export { registerUser, logInUser };
