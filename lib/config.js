'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  glob = require('glob'),
  fs = require('fs'),
  path = require('path');


/**
 * Get files by glob patterns
 */
var getGlobbedPaths = function (globPatterns, excludes) {
  // URL paths regex
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // The output array
  var output = [];

  // If glob pattern is array then we use each pattern in a recursive way, otherwise we use glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      var files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            for (var i in excludes) {
              file = file.replace(excludes[i], '');
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};

/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {
   
  // Set config files
  var config = {
    app: {
      title: 'Flowtify Task REST API',
      version: '1.0.0',
      description: 'A solution to the problem provided by Flowtify'
    },
    port: 3000,
    db: {
      uri: 'mongodb://mongo:27017/flowtify-db',
      // uri: 'mongodb://localhost:27017/flowtify-db',
      options: {
        user: '',
        pass: '',
      },
      debug: false
    },
    // Session Cookie settings
    sessionCookie: {
      maxAge: 24 * (60 * 60 * 1000),
      httpOnly: true,
      secure: false
    },
    sessionSecret: 'Flwtf',
    sessionKey: 'sessionId',
    sessionCollection: 'sessions'
  };

  config.files = {};
  // Setting Globbed route files
  config.files.routes = getGlobbedPaths(['routes/**/!(core)Routes.js', 'routes/coreRoutes.js']);
  config.files.models = getGlobbedPaths(['models/**/*.js']);

  // Expose configuration utilities
  config.utils = {
    getGlobbedPaths: getGlobbedPaths
  };

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
