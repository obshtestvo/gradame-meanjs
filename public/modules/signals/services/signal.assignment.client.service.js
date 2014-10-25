'use strict';

// service for fetching location from GeoIP database based on client address
angular.module('signals').factory('SignalAssignment', ['$resource', function($resource) {
  var SignalAssignment = $resource('/api/signals/:signalId/assignments/:id', { id: '@_id' }, { update: { method: 'PUT' }});

  return SignalAssignment;
}]);

