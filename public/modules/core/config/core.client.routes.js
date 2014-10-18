'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
  function ($stateProvider, $urlRouterProvider, $httpProvider) {
    /*
    $httpProvider.interceptors.push(['TokenHandler', function(TokenHandler) {
      return {
        request: function(config) {
          // add token unless we are requesting an external site
          if (!config.url.match(/^http/)) {
            config.headers['token'] = TokenHandler.get();
          }

          return config;
        }
      }
    }]);
   */

    $stateProvider
      .state('home', {
        url : '',
        templateUrl: 'modules/core/views/home.client.view.html'
      })
      .state('home-dash', {
        url : '/',
        templateUrl: 'modules/core/views/home.client.view.html'
      })
      .state("otherwise", { url : '/'});

    //$locationProvider.client.view.html5Mode(true);
  }
]);

