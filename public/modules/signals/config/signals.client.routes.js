angular.module('signals').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('signals', {
        abstract: true,
        url : '/signals',
        templateUrl: 'modules/signals/views/signals.client.view.html',
        controller: 'SignalsCtrl',
        resolve: {
          location: ['GeoIP', function(GeoIP) {
            return GeoIP.getLocation().$promise
          }],
          constants: ['Signal', function(Signal) {
            return Signal.constants().$promise
          }]
        }
      })
      .state('signals.index', {
        url : '/',
        templateUrl: 'modules/signals/views/signals.index.client.view.html',
        controller: 'SignalsIndexCtrl'
      })
      .state('signals.new', {
        url : '/new',
        templateUrl: 'modules/signals/views/signals.new.client.view.html',
        controller: 'SignalsNewCtrl'
      })
      .state('signals-show', {
        url : '/signals/{signalId}',
        views: {
          '': {
            templateUrl: 'modules/signals/views/signals.show.client.view.html',
            controller: 'SignalsShowCtrl',
          },
          'assignment@signals-show': {
            controller: 'SignalAssignmentsCtrl',
          }
        },
        resolve: {
          signal: ['Signal', '$stateParams', function(Signal, $stateParams) {
            return Signal.get({ _id: $stateParams.signalId }).$promise;
          }]
        }
      })
  }
]);
