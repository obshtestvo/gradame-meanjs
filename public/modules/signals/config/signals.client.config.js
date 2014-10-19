angular.module('signals').config(['$httpProvider',
	function($httpProvider, GoogleMapApi) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }
]);
