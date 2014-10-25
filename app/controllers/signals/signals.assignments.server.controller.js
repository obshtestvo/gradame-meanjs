'use strict';

var mongoose = require('mongoose'),
  SignalAssignment = mongoose.model('SignalAssignment');

var save = function(signal, req, res, next) {
  var newAssignment = new SignalAssignment()
  newAssignment.user = req.targetUser
  newAssignment.role = req.body.role

  signal.assignments.push(newAssignment)
  signal.save(function(err) {
    if (err) return next(err)
    res.jsonp(newAssignment);
  });
}

exports.create = function(req, res, next) {
  var signal = req.signal;
  save(signal, req, res, next)
};

exports.update = function(req, res, next) {
  var signal = req.signal;
  signal.assignments = signal.assignments.filter(function(assignment) {
    return !assignment.user._id.equals( req.targetUser._id)
  })
  return save(signal, req, res, next)
}

exports.delete = function(req, res, next) {
  var signal = req.signal;
  signal.assignments = signal.assignments.filter(function(assignment) {
    return !assignment.user._id.equals(req.targetUser._id)
  })
  signal.save(function(err) {
    if (err) return next(err)
    res.jsonp({});
  });
}


