'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend({
    status: require('./signals/signals.status')
  },
	require('./signals/signals'),
  require('./signals/signals.location')
);
