angular.module('core').factory('TokenHandler', ['$localStorage', function($localStorage) {
  return {
    set: function(token) {
      $localStorage.token = token
    },
    get: function() {
      return $localStorage.token;
    },
    clear: function() {
      delete $localStorage.token;
    }
  }
}]);
