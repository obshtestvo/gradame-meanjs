'use strict';

var mongoose = require('mongoose'),
  Signal = mongoose.model('Signal')

exports.update = function(req, res, next) {
  var signal = req.signal;
  signal.status = req.body.status;

  signal.save(function(err) {
    if (err) return next(err);

    Signal.load(signal.id, function(err, signal) {
      if (err) return next(err);
      res.jsonp(signal);
    });
  });
}

