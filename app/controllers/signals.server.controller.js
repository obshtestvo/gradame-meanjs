'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend({
    activities: require('./signals/signals.activities'),
    assignments: require('./signals/signals.assignments')
  },
	require('./signals/signals'),
	require('./signals/signals.location')
);
