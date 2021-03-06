'use strict';

app.factory('Maps',
  [ '$rootScope', '$timeout',
  function ($rootScope,$timeout) {

    var Maps = {};

    var callbacks = {
      'positionChanged' : [],
      'boundsChanged' : []
    };

    var autocomplete,
        geocoder,
        map,
        marker,
        sigMarkers = [],
        markerClusterer = null,
        _position;

    // TODO: use angular or other lib for event handling
    

    // simple notify
    

    var _updatePosition = function(pos){

      map.setCenter(pos);
      //map.setZoom(13);
      marker.setPosition(pos);
      marker.setAnimation(google.maps.Animation.DROP);

      _position = pos;

      $rootScope.$broadcast('mapPositionChanged',pos);
    };

    Maps.init = function(mapEl, autocompleteEl){
        map = mapEl.control.getGMap();
        geocoder = new google.maps.Geocoder();

        var markerOptions = {
          position: new google.maps.LatLng(mapEl.center.latitude, mapEl.center.longitude),
          map: map,
          icon: new google.maps.MarkerImage("/img/markers/pin.png"),
          animation: google.maps.Animation.DROP
        };

        marker = new google.maps.Marker(markerOptions);
        marker.setMap(map);

        

        // on zoom
        google.maps.event.addListener(map, 'zoom_changed', function () {
          google.maps.event.addListenerOnce(map, 'bounds_changed', function (e) {
            //$scope.filter.bounds = map.getBounds().toString();
            //_notify('boundsChanged');
            //$rootScope.$broadcast('mapBoundsChanged',map.getBounds());
          });
        });

        // on dragend
        google.maps.event.addListener(map, 'dragend', function (e) {
          //$scope.filter.bounds = map.getBounds().toString();
          $rootScope.$broadcast('mapBoundsChanged',map.getBounds());
        });


        // init the position
        _updatePosition(new google.maps.LatLng(mapEl.center.latitude, mapEl.center.longitude));

        // get coords by gps
        navigator.geolocation.getCurrentPosition(function(pos){
          _updatePosition(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        });
    };

    Maps.addMarker = function(markerOpts){

      if(!markerOpts.map)
        markerOpts.map = map

      var sigMarker = new google.maps.Marker(markerOpts);
      sigMarker.setMap(map);
      sigMarkers.push(sigMarker);
    }

    Maps.clearMarkers = function(){
      if(markerClusterer != null){
        markerClusterer.clearMarkers();
      }

      for (var i = 0; i < sigMarkers.length; i++) {
        sigMarkers[i].setMap(null);
      }
      sigMarkers = [];
    }

    Maps.updateCluster = function(){

      if(markerClusterer)
        markerClusterer.setMap(null);

      markerClusterer = new MarkerClusterer(map, sigMarkers, {
        maxZoom: 10,
        gridSize: 10
      });
    }

    Maps.getMap = function(cb){
      if(map){
        cb(map);
      } else {
        $timeout(function(){
            Maps.getMap(cb);
        },500);
      }
    }

    Maps.getBounds = function(){
      if(!map){
        return false;
      }
      return map.getBounds();
    };

    Maps.getPosition  = function(){
      return _position;
    }

    Maps.setPosition  = function(pos){
      _updatePosition(pos);
    }

    Maps.getCenter = function(){
      return map.getCenter();
    }

    Maps.geocode = function(pos, callback){
      geocoder.geocode({'latLng': pos}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            callback(results)
            //infowindow.setContent(results[1].formatted_address);

          }
        } else {
          console.log("Geocoder failed due to: " + status);
        }
      });
    }

    Maps.bindAutocomplete= function(elementId){
      Maps.getMap(function(map){
        var acOptions = {
          types: ['geocode']
        };

        var autocompleteEl = document.getElementById(elementId);
        
        // set up autocomplete
        var autocomplete = new google.maps.places.Autocomplete(autocompleteEl,acOptions);
      
     
        autocomplete.bindTo('bounds',map);

        // handle autocomplete choices
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();

          Maps.setPosition(place.geometry.location);

        });
      })
    }

    return Maps;
  }]);
