"use strict"

angular.module('core').directive('userMySignals', function () {
  return {
    restrict: 'A',
    templateUrl:'modules/core/views/user.mysignals.client.view.html',
    controller: ['$scope', 'Signal', function($scope, Signal) {
      $scope.test = 'test';
      Signal.mine({limit:5},
        function(data) {
          $scope.signals = data
      }, function(errData) {
        console.log({message: 'Fail to load my signals:', errData: errData});
      });
    }]
  }
})