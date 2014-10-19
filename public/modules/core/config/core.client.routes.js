'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
  function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(rejection) {
            if (rejection.status === 404) {
                $location.path('/404');
            }

            if (rejection.status === 500) {
                $location.path('/500');
            }

            return $q.reject(rejection);
         }
     }
    }]);

    $stateProvider
      .state('home', {
        url : '',
        templateUrl: 'modules/core/views/home.client.view.html'
      })
      .state('home-dash', {
        url : '/',
        templateUrl: 'modules/core/views/home.client.view.html'
      })
      .state('404', {
        url : '/404',
        templateUrl: 'modules/core/views/404.client.view.html'
      })
      .state('500', {
        url : '/500',
        templateUrl: 'modules/core/views/500.client.view.html'
      })
      .state("otherwise", { url : '/404'});

    //$locationProvider.client.view.html5Mode(true);
  }
]);

