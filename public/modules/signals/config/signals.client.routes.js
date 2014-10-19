angular.module('signals').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('signals', {
        abstract: true,
        url : '/signals',
        templateUrl: 'modules/signals/views/signals.client.view.html',
        controller: 'SignalsCtrl',
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
        templateUrl: 'modules/signals/views/signals.show.client.view.html',
        controller: 'SignalsShowCtrl',
      })
  }
]);
