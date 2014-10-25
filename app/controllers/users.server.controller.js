'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');
var mongoose = require('mongoose');
var User = mongoose.model('User');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./users/users.authentication'),
	require('./users/users.authorization'),
	require('./users/users.password'),
	require('./users/users.profile'),
  {
    userByIdFromBody: function(req, res, next) {
      User.findById(req.body.userId, function(err, user) {
        if (err && (err.name && err.name!='CastError')) return next(err);
        if (!user) return res.send(404, 'No such user');
        req.targetUser = user;
        next();
      });
    }
  }
);
