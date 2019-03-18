'use strict';

/**
 * Module dependencies.
 */
var config = require('../lib/config'),
  express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  compress = require('compression'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  helmet = require('helmet'),
  flash = require('connect-flash'),
  path = require('path');

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  // Should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Disable views cache
  app.set('view cache', false);

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(flash());
};

/**
 * Configure Express session
 */
module.exports.initSession = function (app, db) {
  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: true,
    resave: false,
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl
    },
    key: config.sessionKey,
    store: new MongoStore({
      mongooseConnection: db.connection,
      collection: config.sessionCollection
    })
  }));
};

/**
 * Configure Authentication configuration
 */
module.exports.initAuthentication = function (app) {
  // Use Passport to authenticate
  var passport = require('../lib/passport');
  passport(app);
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = function (app) {
  // Use helmet to secure Express headers
  var SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

/**
 * Configure Swagger configuration
 */
module.exports.initSwagger = function (app) {
  // Use Swagger to document API
  var swagger = require('../lib/swagger');
  swagger(app);
};

/**
 * Configure the modules server routes
 */
module.exports.initRoutes = function (app) {
  // Setting the app router and static folder
  app.use(express.static(path.resolve('./client')));

  // Enable CORS from client-side
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Credentials', 'true');
    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
      next();
    }
  });

  // Globbing routing files
  config.files.routes.forEach(function (routePath) {
    require(path.resolve(routePath))(app);
  });
};

/**
 * Initialize the Express application
 */
module.exports.init = function (db) {
  var app = express();

  this.initMiddleware(app);
  this.initSession(app, db);
  this.initAuthentication(app);
  this.initHelmetHeaders(app);
  this.initSwagger(app);
  this.initRoutes(app);

  return app;
};
