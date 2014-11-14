// service for fetching location from GeoIP database based on client address
angular.module('signals').factory('SignalStatus', ['$resource', function($resource) {
  var SignalStatus = $resource('/api/signals/:signalId/status', null, { update: { method: 'PUT' }});

  return SignalStatus;
}]);

