require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

/**
 * Middlewares
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * Connection to MongoDB
 */
mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB!'))
  .catch((error) => {
    console.error('Could not Connect to MongoDB...', error);
    process.exit();
  });

/**
 * Schema
 */
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = new mongoose.model('User', userSchema);

/**
 * Routes
 */
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Fundoo Notes Application');
});

app.get('/login', (req, res) => {
  res.status(200).send('login page');
});

app.get('/register', (req, res) => {
  res.status(200).send('register page');
});

app.post('/register', (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.username,
      password: hash,
    });

    newUser.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(500).send('Successfully registered new user in DataBase');
      }
    });
  });
});

app.post('/login', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  res.status(200).send('logged in');

  User.findOne({ email: email }, (err, foundUser) => {
    if (err) {
      res.send(err);
    } else {
      if (foundUser) {
        // Load hash from your password DB.
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result == true) {
            res.send('Logged in successfully.');
          }
        });
      }
    }
  });
});

/**
 * Server
 */
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});
