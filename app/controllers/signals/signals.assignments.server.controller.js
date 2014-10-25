'use strict';

exports.create = function(req, res, next) {
  var signal = req.signal;

  var assignment = new SignalAssignment()
  assignment.user = req.targetUser
  assignment.role = req.body.role

  signal.assignments.push(assignment)
  signal.save(function(err) {
    if (err) return next(err)
    res.jsonp(assignment);
  });
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


