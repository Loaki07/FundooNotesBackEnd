'use strict';
var DEBUG_CONNECTING = 'Connecting to db server %s...';
var DEBUG_ALREADY_CONNECTED = 'Already connected to db server %s.';
var DEBUG_ALREADY_CONNECTING = 'Already connecting to db server %s.';
var DEBUG_CONNECTED = 'Successfully connected to db server %s.';
var DEBUG_CONNECTION_ERROR = 'An error has occured while connecting to db server %s.';
var DEBUG_DISCONNECTING = 'Disconnecting from db server %s...';
var DEBUG_ALREADY_DISCONNECTED = 'Already disconnected from db server %s.';
var DEBUG_ALREADY_DISCONNECTING = 'Already disconnecting from db server %s.';
var DEBUG_DISCONNECTED = 'Successfully disconnected from db server %s.';
var DEBUG_DISCONNECTION_ERROR =
  'An error has occured while disconnecting from db server%s.';

import mongoose from 'mongoose';
import blueBird from 'bluebird';
import dotenv from 'dotenv';
import debug from 'debug';
dotenv.config();

const isState = function (state) {
  return mongoose.connection.readyState === mongoose.Connection.STATES[state];
};

/**
 * @constructor
 *
 * @param {string} uri - Mongoose connection URI.
 * @param {object} options - Mongoose connection options.
 * @see http://mongoosejs.com/docs/connections.html
 *
 */
function MongoDBAdapter(uri, options) {
  this.uri = uri;
  this.options = options;
}
/**
 * @description Add connection listeners without adding more than one for each event.
 * This is done to avoid:
 * 'warning: possible EventEmitter memory leak detected. 11 listeners added'
 * More info: https://github.com/joyent/node/issues/5108
 */
MongoDBAdapter.prototype.addConnectionListener = function (event, cb) {
  var listeners = mongoose.connection._events;
  if (!listeners || !listeners[event] || listeners[event].length === 0) {
    mongoose.connection.once(event, cb.bind(this));
  }
};
/**
  * @description Returns a promise that gets resolved when successfully connected to MongoDB URI,
  or rejected otherwise.
  * @returns {Promise} Returns promise
  */
MongoDBAdapter.prototype.connect = function () {
  return new blueBird(
    function (resolve, reject) {
      if (isState('connected')) {
        d(DEBUG_ALREADY_CONNECTED, this.uri);
        return resolve(this.uri);
      }
      this.addConnectionListener('error', function (err) {
        d(DEBUG_CONNECTION_ERROR, this.uri);
        return reject(err);
      });
      this.addConnectionListener('open', function () {
        d(DEBUG_CONNECTED, this.uri);
        return resolve(this.uri);
      });
      if (isState('connecting')) {
        d(DEBUG_ALREADY_CONNECTING, this.uri);
      } else {
        d(DEBUG_CONNECTING, this.uri);
        mongoose.connect(this.uri, this.options);
      }
    }.bind(this)
  );
};

/**
* @description Returns a promise that gets resolved when successfully disconnected from MongoDB
URI, or rejected otherwise.
* @return {Promise} Bluebird promise
*/
MongoDBAdapter.prototype.disconnect = function () {
  return new blueBird(
    function (resolve, reject) {
      if (isState('disconnected') || isState('uninitialized')) {
        d(DEBUG_ALREADY_DISCONNECTED, this.uri);
        return resolve(this.uri);
      }
      this.addConnectionListener('error', function (err) {
        d(DEBUG_DISCONNECTION_ERROR, this.uri);
        return reject(err);
      });
      this.addConnectionListener('disconnected', function () {
        d(DEBUG_DISCONNECTED, this.uri);
        return resolve(this.uri);
      });
      if (isState('disconnecting')) {
        d(DEBUG_ALREADY_DISCONNECTING, this.uri);
      } else {
        d(DEBUG_DISCONNECTING, this.uri);
        mongoose.disconnect();
      }
    }.bind(this)
  );
};

// Export the mongodb connection instance
// export default MongoDBAdapter;

const d = debug(new MongoDBAdapter());

const db = new MongoDBAdapter(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

db.connect().then(function (uri) {
  console.log('Connected to ' + uri);
});

export default db;
