'use strict';

var mongoose = require('mongoose'),
  SignalAssignment = mongoose.model('SignalAssignment');

var destroyAssignment = function(signal, oldAssignment) {
  signal.assignments = signal.assignments.filter(function(assignment) {
    return !assignment.user._id.equals(oldAssignment.user._id)
  });

  return signal
}

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
  var signal = filterSignalAssignment(req.signal, req.assignment);

  var assignment = SignalAssignment(req.bodyParams)
  signal.assignments.push(assignment)

  signal.save(function(err) {
    if (err) return next(err)
    res.jsonp(assignment);
  })
}

exports.delete = function(req, res, next) {
  var signal = filterSignalAssignment(req.signal, req.assignment)

  signal.save(function(err) {
    if (err) return next(err)
    res.jsonp({});
  })
}

exports.permittedAttributes = ['user', 'role'];

exports.populateAssignment = function(req, res, next) {
  _.each(permittedAttributes, function(attr) {
    req.bodyParams = req.body[attr]
  })

  // assignment exists get it from signal
  req.assignment = req.signal.findAssignmentById(req.query.id);
  if (_.isUndefined(req.assignment)) return res.send(404, 'No such assignment');

  next()
}

exports.policy = {}
exports.policy.assign = exports.policy.unassign  = function(req, bodyParams) {
  if (_.isUndefined(bodyParams)) bodyParams = req.bodyParams

  if (req.user.isSuper())
    return true;

  // update && delete
  if (req.assignment)
    return req.assignment.user._id == req.bodyParams.user

  // create
  return req.user._id == req.bodyParams.user;
}

