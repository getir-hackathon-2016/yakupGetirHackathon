'use strict';

angular.module('myApp', ['ngRoute', 'uiGmapgoogle-maps'])

    .config(['$routeProvider', 'uiGmapGoogleMapApiProvider', function ($routeProvider, uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
      }),
      $routeProvider.when('/maps', {
        templateUrl: 'maps/maps.ejs',
        controller: 'MapsController'
      });
    }])

    .config(function(uiGmapGoogleMapApiProvider) {

    })
    .controller('InfoController', function ($scope, $log) {
      $scope.templateValue = 'hello from the template itself';
      $scope.clickedButtonInWindow = function () {
        var msg = 'clicked a window in the template!';
        $log.info(msg);
        alert(msg);
      }
    })

    .controller('AddressController',['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
      $scope.latitude = 0;
      $scope.longitude = 0;

      getLocation(function(position){
        $scope.latitude = position.coords.latitude;
        $scope.longitude = position.coords.longitude;
      });

      $scope.addAdress = function () {
        $scope.address = {title: $scope.title, latitude: $scope.latitude, longitude: $scope.longitude}
        console.log($scope.address);
        $http.post('/address', $scope.address).success(function (data, status) {
          console.log(status);
        });
      }
    }])

    .controller('MapsController', ['$scope', '$timeout', '$http', 'uiGmapGoogleMapApi', function ($scope, $timeout, $http, uiGmapGoogleMapApi) {
      $scope.onMarkerClicked = function (marker) {
        marker.showWindow = true;
        $scope.$apply();
        //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
      };


      $scope.setPosition = function (position) {
        $scope.latitude = position.coords.latitude;
        $scope.longitude = position.coords.longitude;

        $scope.map.center = {
          latitude: $scope.latitude, longitude: $scope.longitude
        };
        $scope.map.zoom = 15;
        $scope.map.markers = [
          {
            id: 1,
            latitude: $scope.latitude,
            longitude: $scope.longitude,
            showWindow: false,
            options: {
              animation: 1,
              labelContent: 'Current Location',
              labelAnchor: "22 0",
              labelClass: "marker-labels"
            }
          }
        ];

        $scope.map.clickMarkers = [];
        $scope.map.clickedMarker = {
          id: 0,
          options: {}
        };

        $scope.map.events = {
          click: function (mapModel, eventName, originalEventArgs) {
            console.log('test clcik');
            var e = originalEventArgs[0];
            var lat = e.latLng.lat(),
                lon = e.latLng.lng();
            $scope.map.clickedMarker = {
              id: 0,
              options: {
                labelContent: 'You clicked here ' + 'lat: ' + lat + ' lon: ' + lon,
                labelClass: "marker-labels",
                labelAnchor: "50 0"
              },
              latitude: lat,
              longitude: lon
            };
            //scope apply required because this event handler is outside of the angular domain
            $scope.$apply();
          },
          dragend: function () {
            console.log('test dragend');
            $timeout(function () {
              var markers = [];

              var id = 0;
              if ($scope.map.mexiMarkers !== null && $scope.map.mexiMarkers.length > 0) {
                var maxMarker = _.max($scope.map.mexiMarkers, function (marker) {
                  return marker.mid;
                });
                id = maxMarker.mid;
              }
              for (var i = 0; i < 4; i++) {
                id++;
                markers.push(createRandomMarker(id, $scope.map.bounds, "mid"));
              }
              $scope.map.mexiMarkers = markers.concat($scope.map.mexiMarkers);
            });
          }
        };
        _.each($scope.map.markers, function (marker) {
          marker.closeClick = function () {
            marker.showWindow = false;
            $scope.$evalAsync();
          };
          marker.onClicked = function () {
            onMarkerClicked(marker);
          };
        });

      };

      getLocation($scope.setPosition);

      uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = {
          center: { latitude: 0, longitude: 0 },
          zoom: 8,
          markers: [
            {
              latitude: 0,
              longitude: 0
            }
          ]
        };
        maps.visualRefresh = true;
      });

    }]);

var getLocation = function(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(callback);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
};
