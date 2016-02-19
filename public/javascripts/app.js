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

    .controller('MapsController', ['$scope', '$timeout', '$http', 'uiGmapGoogleMapApi', function ($scope, $timeout, $http, uiGmapGoogleMapApi) {
      var lat = 0;
      var long = 0;

      $scope.onMarkerClicked = function (marker) {
        console.log('onMarkerClicked');
        marker.showWindow = true;
        $scope.$apply();
        //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
      };

      $scope.getLocation = function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition($scope.setPosition);
        } else {
          x.innerHTML = "Geolocation is not supported by this browser.";
        }
      };

      $scope.setPosition = function (position) {
        $scope.latitude = position.coords.latitude;
        $scope.longitude = position.coords.longitude;

        console.log($scope.latitude);
        console.log($scope.longitude);
        $scope.map.center = {
          latitude: $scope.latitude, longitude: $scope.longitude
        };
        $scope.map.zoom = 15;
        $scope.map.markers = [
          {
            id: 1,
            latitude: 41.0785157,
            longitude: 29.022107499999994,
            showWindow: false,
            options: {
              animation: 1,
              labelContent: 'Markers id 1',
              labelAnchor: "22 0",
              labelClass: "marker-labels"
            }
          }
        ];

        _.each($scope.map.markers, function (marker) {
          console.log('markers')
          marker.closeClick = function () {
            marker.showWindow = false;
            $scope.$evalAsync();
          };
          marker.onClicked = function () {
            onMarkerClicked(marker);
          };
        });

      };

      $scope.getLocation();

      uiGmapGoogleMapApi.then(function(maps) {
        $scope.map = {
          center: { latitude: 0, longitude: 0 },
          zoom: 8,
          markers: [
            {
              latitude: 41.0785157,
              longitude: 29.0221384
            }
          ]
        };
        maps.visualRefresh = true;
      });

    }]);
