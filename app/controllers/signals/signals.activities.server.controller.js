'use strict';

exports.activitiesAdd = function(req, res) {
  var signal = req.signal;

  if (!signal.acitvities)
    signal.acitvities = [];

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



