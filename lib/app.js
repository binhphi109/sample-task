'use strict';

/**
 * Module dependencies.
 */
var config = require('./config'),
  mongoose = require('./mongoose'),
  express = require('./express'),
  chalk = require('chalk');

module.exports.init = function init(callback) {
  var _this = this;

  mongoose.connect(function (db) {
    // Initialize Models
    mongoose.loadModels();

    // Initialize express
    var app = express.init(db);
    if (callback) callback(app, db, config);
  });
};

module.exports.start = function start(callback) {
  var _this = this;

  _this.init(function (app, db, config) {
    // Start the app by listening on <port>
    app.listen(config.port, function () {

      // Logging initialization
      console.log('--');
      console.log(chalk.green(config.app.title));
      console.log(chalk.green('Port:\t\t\t\t' + config.port));
      console.log(chalk.green('Database:\t\t\t\t' + config.db.uri));
      console.log('--');

      if (callback) callback(app, db, config);
    });
  });
};

module.exports.close = function close(callback) {
  mongoose.disconnect(function (db) {
    if (callback) callback();
  });
};