'use strict';

angular.module('signals').controller('SignalsCtrl', ['$scope', '$location', '$http', '$timeout', 'Signal', 'Maps', 'geolocation',
  function ($scope, $location, $http, $timeout, Signal, Maps, geolocation) {
    $scope.signals = [];

    $scope.signalTypes = [
      "Улична дупка",
      "Липсваща шахта",
      "Висящи кабели",
      "Нерегламентиран боклук",
      "Вандализъм"
    ];

    $scope.signalStatuses = [
      "отворен",
      "решен"
    ];

    $scope.params = {
      bounds: "",
      location: "",
      type: "",
      status: ""
    };

    function reloadSignals() {
      if (!$scope.params.bounds || $scope.params.bounds == "") {
        return;
      }

      Signal.query($scope.params, function(signals) {
        var i = 0, markers = [];

        _.each(signals, function(sig) {
          markers.push({
            id: i,
            options: {
              animation: google.maps.Animation.DROP
            },
            icon: '/modules/signals/img/markers/sign.png',
            coords: {
              latitude: sig.location[0],
              longitude: sig.location[1]
            }
          })
        })

        $scope.markers = markers;
        $scope.signals = signals;
      });
    }

    $scope.$watch('params', reloadSignals, true);

    $scope.currentMarker = {
      id: "center",
      options: {
        animation: google.maps.Animation.DROP
      },
      icon: '/modules/signals/img/markers/pin.png',
      coords: {
        latitude: 42.7,
        longitude: 23.3
      }
    }

    $scope.map = {
        control: {},
        options: {
              streetViewControl: false,
              panControl: false,
              maxZoom: 20,
              minZoom: 3
          },
          center: {
            latitude: 42.7,
            longitude: 23.3
          },
        zoom: 15,
        events: {
          idle: function(map, eventName, originalEventArgs) {
            $scope.params.bounds = map.getBounds().toString();
            var center = map.getCenter();

            var coords = {
              latitude: center.lat(),
              longitude: center.lng()
            }
          }
        }
    };

    geolocation.getLocation().then(function(data){
      $scope.map.center = data.coords;
      $scope.currentMarker.coords = data.coords;
    });
  }
]);
