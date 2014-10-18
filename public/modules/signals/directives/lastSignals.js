angular.module('core').directive('lastSignals', function () {
  return {
    restrict: 'A',
    templateUrl:'modules/signals/views/signals.last.client.view.html',
    controller: ['$scope', 'Signal', function($scope, Signal) {
      $scope.signals = Signal.query({limit: 3},
        function(data) {
          $scope.signals = data
      }, function(errData) {
        console.log({message: 'Fail to load latest signals:', errData: errData});
      });
    }]
  }
})
