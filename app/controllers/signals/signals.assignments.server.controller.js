'use strict';

var mongoose = require('mongoose'),
  SignalAssignment = mongoose.model('SignalAssignment'),
  _ = require('lodash');

exports.create = function(req, res, next) {
  var signal = req.signal;

  var assignment = new SignalAssignment(req.bodyParams);
  signal.assignments.push(assignment)

  signal.save(function(err) {
    if (err) return next(err)
      res.jsonp(assignment);
  })
};

exports.update = function(req, res, next) {
  req.signal.removeAssignment(req.assignment)

  var assignment = SignalAssignment(req.bodyParams)
  signal.assignments.push(assignment)

  signal.save(function(err) {
    if (err) return next(err)
    res.jsonp(assignment);
  })
}

exports.delete = function(req, res, next) {
  req.signal.removeAssignment(req.bodyParams)

  signal.save(function(err) {
    if (err) return next(err)
    res.jsonp({});
  })
}

exports.populateAssignment = function(req, res, next) {
  // assignment exists get it from signal
  req.assignment = req.signal.findAssignmentById(req.query.id);

  if (_.isUndefined(req.assignment)) return res.send(404, 'No such assignment');

  next()
}


