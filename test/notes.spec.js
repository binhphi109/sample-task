'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  request = require('supertest'),
  User = require('../models/user'),
  Note = require('../models/note'),
  app = require('../lib/app');

/**
 * Globals
 */
var agent,
  credentials,
  user,
  note;

describe('Notes', function() {

  before(function (done) {
    // Get application
    app.init(function (app, db, config) {
      agent = request.agent(app);
      done();
    });
  });

  beforeEach(function(done) {
    // Create user credentials
    credentials = {
      username: 'userTest',
      password: 'pAsStEsT'
    };

    // Create a new user
    user = new User({
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password
    });

    // Save a user to the test db and create new note
    user.save()
      .then(function () {
        note = {
          content: 'Note Content',
          user: user
        };

        done();
      })
      .catch(done);
  });

  it('should be able to create a note if logged in', function (done) {
    agent.post('/api/users/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/notes')
          .send(note)
          .expect(200)
          .end(function (noteCreateErr, noteCreateRes) {
            // Handle create error
            if (noteCreateErr) {
              return done(noteCreateErr);
            }
            
            noteCreateRes.body.content.should.equal(note.content);

            return done();
          });

      });
  });

  it('should not be able to create a note if not logged in', function (done) {
    agent.post('/api/notes')
      .send(note)
      .expect(403)
      .end(function (noteCreateErr, noteCreateRes) {
        if (noteCreateErr) {
          return done(noteCreateErr);
        }

        return done();
      });
  });

  it('should be able to get a list of notes if logged in', function (done) {
    // Create new article model instance
    var noteObj = new Note(note);

    // Save the note
    noteObj.save(function (err) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/users/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
        // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Request notes
          agent.get('/api/notes')
            .expect(200)
            .end(function (notesErr, notesRes) {
              // Handle error
              if (notesErr) {
                return done(notesErr);
              }
            
              // Set assertions
              notesRes.body.should.be.instanceof(Array).and.have.lengthOf(1);
            
              // Call the assertion callback
              done();
            });

        });
      
    });
  });

  it('should not be able to get a list of notes if not logged in', function (done) {
    
    // Request notes
    agent.get('/api/notes')
      .expect(403)
      .end(function (notesErr, notesRes) {
        // Call the assertion callback
        done(notesErr);
      });

  });

  afterEach(function (done) {
    Note.remove().exec()
      .then(User.remove().exec())
      .then(done())
      .catch(done);
  });

  after(function (done) {
    app.close(function() {
      done();
    });
  });
});
  