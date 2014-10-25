'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./signals/signals'),
	require('./signals/signals.location'),
	require('./signals/signals.assignments'),
	require('./signals/signals.activities')
);

