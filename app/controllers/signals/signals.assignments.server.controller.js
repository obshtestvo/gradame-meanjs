'use strict';

exports.create = function(req, res, next) {
  var signal = req.signal;

  var assignment = new SignalAssignment()
  assignment.user = req.targetUser
  assignment.role = req.body.role

  signal.handled_by.push(assignment)
  signal.save(function(err) {
    if (err) return next(err)
    res.jsonp(signal);
  });
}

// @TODO implement
exports.delete = function(req, res) {
  var signal = req.signal;
  signal.handled_by = signal.handled_by.filter(function(assignment) {
    return !assignment.user._id.equals(req.targetUser._id)
  })
  signal.save(function(err) {
    if (err) return next(err)
    res.jsonp(signal);
  });
}


