'use strict';

var _ = require('lodash');

exports.create = function(req, res) {
  var signal = req.signal;

  var activity = _.extend({}, req.body);
  if (req.user && req.user.id) {
    activity.createdBy = req.user.id;
  }

  signal.activities.push(activity);

  signal.save(function(err) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(signal);
    }
  });
}



