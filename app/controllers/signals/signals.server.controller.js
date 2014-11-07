'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Signal = mongoose.model('Signal'),
  SignalAssignment = mongoose.model('SignalAssignment'),
  User = mongoose.model('User'),
  fs = require('fs'),
  Q = require('q'),
  path = require('path'),
  _ = require('lodash'),
  SignalModel = require('../../models/signal')


/**
 * Create a signal
 */
// TODO: Implement Promises
exports.create = function(req, res) {

  var location = req.body.location;

  if(location && location.length){
    location = location.substr(1,location.length-2);
    req.body.location = location.split(', ');
  }

  var signal = new Signal(req.body);

  if (req.user && req.user.id) {
    signal.created_by = req.user.id;
  }

  signal.save(function(err) {
    if (err) {
      res.jsonp({
        errors: err.errors,
        signal: signal
      });
    } else {
      // populate files
      if(req.files){
        signal.savePhotoFiles(req.files)
        signal.save(function(){
          if (err) {
            res.jsonp({
              errors: err.errors,
              signal: signal
            });
          } else {
            res.jsonp(signal);
          }
        });
      } else {
        res.jsonp(signal);
      }
    }
  });
};

/**
 * Show the current signal
 */
exports.read = function(req, res) {
  res.jsonp(req.signal);
};

/**
 * Update a signal
 */
exports.update = function(req, res) {
  var signal = req.signal;

  signal = _.extend(signal, req.body);

  signal.save(function(err) {
    if (err) {
      console.log("------------------------------------------");
      console.log(err);
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(signal);
    }
  });
};

/**
 * Delete an signal
 */
exports.delete = function(req, res) {
  var signal = req.signal;

  signal.remove(function(err) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(signal);
    }
  });
};

/**
 * Signal Index
 */
exports.index = function(req, res) {
  var bounds = {
    ne: [ req.query.neLat, req.query.neLng ],
    sw: [ req.query.swLat, req.query.swLng ]
  }

  var params = {
    location: { $geoWithin : { $box : [  bounds.sw, bounds.ne ] } },
  }

  if (req.query.type)
    params.type = req.query.type

  if (req.query.status)
    params.status = req.query.status

  Signal.find(params).sort('-date_created').limit(req.query.limit ? req.query.limit : 0).populate('user', 'displayName').exec(function(err, signals) {
    if (err) {
      res.jsonp('error', {
        status: 500,
        err: err
      });
    } else {
      res.jsonp(signals);
    }
  });
};

exports.mine = function(req, res) {
  var params = {
    created_by: req.user._id,
  }

  if (req.query.type)
    params.type = req.query.type

  if (req.query.status)
    params.status = req.query.status

  Signal.find(params).sort('-date_created').limit(req.query.limit ? req.query.limit : 0).populate('user', 'displayName').exec(function(err, signals) {
    if (err) {
      res.jsonp('error', {
        status: 500,
        err: err
      });
    } else {
      res.jsonp(signals);
    }
  });
};

exports.constants = function(req, res) {
  res.jsonp(SignalModel.constants)
}

exports.findNear = function(req, res) {
  var location = req.query.location;

  if (location && location.length){
    location = location.substr(1,location.length-2);
    req.query.location = location.split(', ');
  }

  if (!location.length){
    console.error({err: 'Location is malformed', location: location});
    res.jsonp('error', {
      status: 500
    });
  }
  else {
    // $maxDistance: 0.00019
    Signal.find({location: { $nearSphere: req.query.location, $maxDistance: 0.00025} }, function(err, signals) {
      if (err) {
        res.jsonp('error', {
          status: 500
        });
      } else {
        res.jsonp(signals);
      }
    });
  }
};


/**
 * Signal middleware
 */
exports.signalByID = function(req, res, next, id) {
  Signal.load(id, function(err, signal) {
    if (err && (err.name && err.name!='CastError')) return next(err);
    if (!signal) return res.send(404, 'No such signal');
    req.signal = signal;
    next();
  });
};

/**
 * Signal ownership middleware
 */
exports.hasOwnership = function(req, res, next) {
  if (req.signal.created_by.id !== req.user.id) {
    return res.send(403, 'User is not authorized');
  }
  next();
};
