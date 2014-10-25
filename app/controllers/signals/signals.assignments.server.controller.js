'use strict';

exports.create = function(req, res, next) {
  var signal = req.signal;

  var newAssignment = new SignalAssignment()
  newAssignment.user = req.targetUser
  newAssignment.role = req.body.role

  signal.assignments = signal.assignments.filter(function(assignment) {
    return !assignment.user._id.equals( newAssignment.user._id)
  })

  signal.assignments.push(newAssignment)
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


