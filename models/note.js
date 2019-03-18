'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Note Schema
 */
var NoteSchema = new Schema({
  content: {
    type: String,
    default: '',
    required: 'Please fill Note content',
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Note', NoteSchema);
