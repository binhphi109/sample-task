'use strict';

/**
 * Module dependencies.
 */
var baseUrl = '/api/',
  policy = require('../policies/notesPolicy'),
  api = require('../controllers/notesController');

module.exports = function (app) {
  
  /**
   * @swagger
   * /notes:
   *    get:
   *      description: This method allows to retrieve all notes for current logged user
   *      tags:
   *        - Notes
   *      responses:
   *        200: 
   *          description: Returns all notes of current logged user
   *    post:
   *      description: This method allows to create a new note
   *      tags:
   *        - Notes
   *      consumes: 
   *        - application/x-www-form-urlencoded
   *      parameters:
   *        - name: content
   *          in: formData
   *          type: string
   *          description: A note's content
   *      responses:
   *        200:
   *          description: Returns the successful created note
   */
  app.route(baseUrl + 'Notes').all(policy.isAllowed)
    .get(api.list)
    .post(api.create);

  /**
   * @swagger
   * /notes/{nodeId}:
   *    get:
   *      description: This method allows to retrieve a specific note
   *      tags:
   *        - Notes
   *      parameters:
   *        - name: nodeId
   *          in: path
   *          type: string
   *          required: true
   *      responses:
   *        200: Returns the specific note
   */
  app.route(baseUrl + 'Notes/:noteId').all(policy.isAllowed)
    .get(api.read);

  // Finish by binding the Note middleware
  app.param('noteId', api.noteByID);
};
