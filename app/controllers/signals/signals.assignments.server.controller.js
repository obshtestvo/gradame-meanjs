'use strict';

var mongoose = require('mongoose'),
  SignalAssignment = mongoose.model('SignalAssignment');

var filterSignalAssignment = function(signal, oldAssignment) {
  signal.assignments.push(req.assignment)
  signal.assignments = signal.assignments.filter(function(assignment) {
    return !assignment.user._id.equals(oldAssignment.user._id)
  });
  return signal
}

var save = function(signal, req, res, next) {
  signal.save(function(err) {
    if (err) return next(err)
    res.jsonp(req.assignment);
  });
}

exports.create = function(req, res, next) {
  var signal = req.signal;
  signal.assignments.push(req.assignment)
  save(signal, req, res, next)
};

exports.update = function(req, res, next) {
  req.signal = filterSignalAssignment(req.signal, req.assignment);
  req.assignment = SignalAssignment()
  newAssignment.user = req.targetUser
  newAssignment.role = req.body.role
  exports.create(req, res, next)
}

exports.delete = function(req, res, next) {
  save(filterSignalAssignment(req.signal, req.assignment), req, res, next)
}

exports.populateAssignment = function(req, res, next) {
  // assignment doesn't exist, init
  if (!req.query.id) {
    User.findById(req.body.user, function (err, user) {
      if (err && (err.name && err.name != 'CastError')) return next(err);
      if (!user) return res.send(400, 'Invalid assignee');
      req.assignment = new SignalAssignment({
        user: user,
        role: req.body.role
      });
      next()
    });
    return
  }

  // assignment exists get it from signal
  var assignments = _.filter(req.signal.assignments, function(assignment) {
    return assignment._id == req.query.id
  })
  if (!assignments.length) return res.send(404, 'No such assignment');
  req.assignment = assignments[0]
  next()
}



exports.policy = {}
exports.policy.assign = exports.policy.unassign  = function(req, scopeData) {
  if (_.isUndefined(scopeData)) scopeData = req.assignment
  return req.user.isSuper() || scopeData.user._id == req.userId
}

