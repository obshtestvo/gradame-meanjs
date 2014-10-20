'use strict';

// service for fetching location from GeoIP database based on client address
angular.module('signals').factory('GeoIP', ['$resource', function($resource) {
  return $resource('/api/location', {}, { getLocation: { method: 'GET' }});
}]);

