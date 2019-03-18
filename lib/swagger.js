'use strict';

/**
 * Module dependencies.
 */

var swaagerUi = require('swagger-ui-express'),
  swaggerJsdoc = require('swagger-jsdoc'),
  config = require('./config');

var options = {
  swaggerDefinition: {
    info: {
      title: config.app.title,
      version: config.app.version,
      description: config.app.description
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: config.files.routes,
};

var specs = swaggerJsdoc(options);

module.exports = function (app) {
  app.use('/api-docs', swaagerUi.serve, swaagerUi.setup(specs));
};