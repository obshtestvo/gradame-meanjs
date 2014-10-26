'use strict';

var maxmind = require('maxmind'),
    _ = require('lodash');

maxmind.init('data/GeoLiteCity.dat');

exports.location = function(req, res) {
  var addr = req.connection.remoteAddress,
      fwdForHeader = req.headers['x-forwarded-for']

  if (fwdForHeader)
    addr = fwdForHeader.split(',')[0];

  var location = maxmind.getLocation(addr);

  // set default location to Sofia
  if (location == null) {
    location = {
      countryCode: 'BG',
      countryName: 'Bulgaria',
      city: 'Sofia',
      latitude: 42.6833,
      longitude: 23.316699999999997,
    }
  }

  res.jsonp(location);
};

