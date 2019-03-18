'use strict';

/**
 * Module dependencies
 */

/**
 * Check If Notes Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var isAllowed = (req.user) ? true : false;

  if (isAllowed) {
    // Access granted! Invoke next middleware
    return next();
  } else {
    return res.status(403).json({
      message: 'User is not authenticated'
    });
  }
};
