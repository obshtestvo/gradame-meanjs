'use strict';

angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
  function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.interceptors.push(['TokenHandler', function(TokenHandler) {
      return {
        request: function(config) {
          // add token unless we are requesting an external site
          if (!config.url.match(/^http/)) {
            config.headers['x-token'] = TokenHandler.get();
          }

          return config;
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
      .state('signals', {
        url : '/signals',
        templateUrl: 'modules/core/views/signals.client.view.html',
        controller: 'SignalsCtrl'
      })
      .state('signals-new', {
        url : '/signals/new',
        templateUrl: 'modules/core/views/signals.new.client.view.html',
        controller: 'SignalsNewCtrl'
      })
      .state('signals-view', {
        url : '/signals/{signalId}',
        templateUrl: 'modules/core/views/signals.view.client.view.html',
        controller: 'SignalsViewCtrl'
      })
      .state("otherwise", { url : '/'});

    //$locationProvider.client.view.html5Mode(true);
  }
]);

