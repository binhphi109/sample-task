'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  path = require('path'),
  mongoose = require('mongoose'),
  Note = mongoose.model('Note'),
  errorHandler = require('./errorsController');

/**
 * Create a Note
 */
exports.create = function(req, res) {
  var note = new Note(req.body);
  note.user = req.user;

  note.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(note);
    }
  });
};

/**
 * Show the current Note
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var note = req.note ? req.note.toJSON() : {};

  res.jsonp(note);
};

/**
 * List of Notes
 */
exports.list = function(req, res) { 

  Note.find({ 'user': req.user }).sort('-created')
    .exec(function(err, notes) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(notes);
      }
    });
};

/**
 * Note middleware
 */
exports.noteByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Note is invalid'
    });
  }

  Note.findById(id)
    .exec(function (err, note) {
      if (err) {
        return next(err);
      } else if (!note) {
        return res.status(404).send({
          message: 'No Note with that identifier has been found'
        });
      }
      req.note = note;
      next();
    });
};
