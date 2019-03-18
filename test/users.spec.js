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
  _user,
  user,
  note;

describe('Users', function() {

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

    _user = {
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password
    }

    // Create a new user
    user = new User(_user);

    // Save a user to the test db
    user.save(function (err) {
      should.not.exist(err);
      done();
    });
  });

  it('should be able to register a new user', function (done) {

    _user.username = 'register_new_user';
    _user.email = 'register_new_user_@test.com';

    agent.post('/api/users/signup')
      .send(_user)
      .expect(200)
      .end(function (signupErr, signupRes) {
        // Handle signup error
        if (signupErr) {
          return done(signupErr);
        }

        signupRes.body.username.should.equal(_user.username);
        signupRes.body.email.should.equal(_user.email);

        return done();
      });
  });

  it('should be able to login with username successfully and logout successfully', function (done) {
    // Login with username
    agent.post('/api/users/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Logout
        agent.post('/api/users/signout')
          .expect(200)
          .end(function (signoutErr, signoutRes) {
            if (signoutErr) {
              return done(signoutErr);
            }

            should.not.exist(signoutRes.body);

            return done();
          });
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
  