'use strict';

angular.module('signals').controller('SignalsIndexCtrl', ['$scope', '$location', '$http', '$timeout', 'Signal', 'geolocation',
  function ($scope, $location, $http, $timeout, Signal, geolocation) {
    $scope.signals = [];

    $scope.params = {
      bounds: "",
      location: "",
      type: "",
      status: ""
    };

    $scope.map.events.idle = function(map, eventName, originalEventArgs) {
      $scope.params.bounds = map.getBounds().toString();
      var center = map.getCenter();

      var coords = {
        latitude: center.lat(),
        longitude: center.lng()
      }
    }

    function reloadSignals() {
      if (_.isEmpty($scope.params.bounds))
        return;

      Signal.query($scope.params, function(signals) {
        _.each(signals, function(sig) {
          var id = sig._id
          if ($scope.loadedMarkersRegistry.indexOf(id) > -1) return;
          $scope.markers.push({
            id: id,
            options: {
              animation: google.maps.Animation.DROP
            },
            icon: '/modules/signals/img/markers/sign.png',
            coords: {
              latitude: sig.location[0],
              longitude: sig.location[1]
            }
          })
          $scope.loadedMarkersRegistry.push(id)
        })

        $scope.signals = signals;
      });
    }

    $scope.$watch('params', reloadSignals, true);

    $scope.autocomplete = {
      details: {},
      options: {
        country: 'bg'
      }
    }

    $scope.$watch('autocomplete.details', function(details) {
      if (_.isEmpty(details))
        return;

      var location = details.geometry.location;

      var coords = {
        latitude: location.lat(),
        longitude: location.lng()
      }

      $scope.map.center = coords;
    });
  }
])

angular.module('signals').controller('SignalsCtrl', ['$scope', '$location', '$http', '$timeout', 'Signal', 'geolocation',
  function ($scope, $location, $http, $timeout, Signal, geolocation) {
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

    $scope.markers = []
    $scope.loadedMarkersRegistry = [];

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
      events: {}
    };

    geolocation.getLocation().then(function(data){
      $scope.map.center = data.coords;
      $scope.currentMarker.coords = data.coords;
    });
  }
]);
