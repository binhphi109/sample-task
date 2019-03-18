'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function (app) {
  // User Routes
  var baseUrl = '/api/',
    api = require('../controllers/usersController');

  /**
   * @swagger
   * /users/signup:
   *    post:
   *      description: This method allows to register a new user
   *      tags:
   *        - Users
   *      consumes: 
   *        - application/x-www-form-urlencoded
   *      parameters:
   *        - name: email
   *          in: formData
   *          description: A user's email
   *          type: string
   *          required: true
   *        - name: username
   *          in: formData
   *          description: A user's username
   *          type: string
   *          required: true
   *        - name: password
   *          in: formData
   *          description: A user's password
   *          type: string
   *          required: true
   *      responses:
   *        200: 
   *          description: Returns the successful created user
   */
  app.route(baseUrl + 'Users/signup').post(api.signup);

  /**
   * @swagger
   * /users/signin:
   *    post:
   *      description: This method allows to log a user in
   *      tags:
   *        - Users
   *      consumes: 
   *        - application/x-www-form-urlencoded
   *      parameters:
   *        - name: username
   *          in: formData
   *          description: A user's username
   *          type: string
   *          required: true
   *        - name: password
   *          in: formData
   *          description: A user's password
   *          type: string
   *          required: true
   *      responses:
   *        200: 
   *          description: Returns the successful logged-in user
   */
  app.route(baseUrl + 'Users/signin').post(api.signin);

  /**
   * @swagger
   * /users/signout:
   *    post:
   *      description: This method allows to log a user out
   *      tags:
   *        - Users
   *      responses:
   *        200: 
   *          description: Returns null
   *      
   */
  app.route(baseUrl + 'Users/signout').post(api.signout);

};
