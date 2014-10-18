angular.module('signals').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('signals', {
        url : '/signals',
        templateUrl: 'modules/signals/views/signals.client.view.html',
        controller: 'SignalsCtrl'
      })
      .state('signals-new', {
        url : '/signals/new',
        templateUrl: 'modules/signals/views/signals.new.client.view.html',
        controller: 'SignalsNewCtrl'
      })
      .state('signals-view', {
        url : '/signals/{signalId}',
        templateUrl: 'modules/signals/views/signals.view.client.view.html',
        controller: 'SignalsViewCtrl'
      })
  }
]);
