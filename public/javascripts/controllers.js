angular.module('myApp')

    .controller('HomeController', function ($scope) {

    })

    .controller('InfoController', function ($scope) {
      $scope.templateValue = 'hello from the template itself';
      $scope.clickedButtonInWindow = function () {
        var msg = 'clicked a window in the template!';
        $log.info(msg);
        alert(msg);
      }
    })

    .controller('ProductController', ['$scope', '$http', '$location', function ($scope, $http, $location) {

      $http.get('/products').success(function (data, status) {
        $scope.products = data;
      });

      $scope.addCart = function(product_id){
        $http.post('/cart/' + product_id, {}).success(function (data, status) {
          $scope.cart = data.cart;
        });
        console.log("path");
        $location.path('/cart');
      };
    }])
    .controller('CartController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
      console.log('CartController');
      $http.get('/cart').success(function (data, status) {
        $scope.cart = data.cart;
      });

      $scope.emptyCart = function(){
        $http.delete('/cart').success(function (data, status) {
          $scope.cart = data.cart;
        });
        $location.path('/cart');
      };
    }])

    .controller('AddressController',['$scope', '$http', '$routeParams', '$location', function ($scope, $http, $routeParams, $location) {
      $scope.latitude = 0;
      $scope.longitude = 0;
      console.log('AddressController');
      getLocation(function(position){
        $scope.latitude = round(position.coords.latitude, 5);
        $scope.longitude = round(position.coords.longitude, 5);
      });

      $scope.addAdress = function () {
        address = {title: $scope.title, latitude: $scope.latitude, longitude: $scope.longitude}
        $http.post('/address', address).success(function (data, status) {
          console.log(status);
        });
        $location.path('/address');
      }
    }])

    .controller('MapsController', ['$scope', '$timeout', '$http', '$location', 'uiGmapGoogleMapApi', function ($scope, $timeout, $http, $location, uiGmapGoogleMapApi) {
      $scope.onMarkerClicked = function (marker) {
        marker.showWindow = true;
        $scope.$apply();
      };
      $http.get('/address').success(function (data, status) {
        $scope.user_addresses = data;
        if($scope.user_addresses && $scope.user_addresses.length > 0){
          $location.path('/address');
        }
        else{
          $location.path('/home');
        }
      });
      $scope.setPosition = function (position) {
        $scope.latitude = round(position.coords.latitude, 5);
        $scope.longitude = round(position.coords.longitude, 5);



        $scope.map.center = {
          latitude: $scope.latitude, longitude: $scope.longitude
        };
        $scope.map.markers = [
          {
            id: 1,
            latitude: $scope.latitude,
            longitude: $scope.longitude,
            showWindow: false,
            options: {
              labelContent: 'Current Location',
              labelAnchor: "22 0",
              labelClass: "marker-labels"
            }
          }
        ];
        $scope.map.zoom = 15;
        console.log($scope.user_addresses)
        _.each($scope.user_addresses, function(address){
          if($scope.latitude != address.latitude && $scope.longitude != address.longitude ){
            $scope.map.markers.push({
              id: address._id,
              latitude: address.latitude,
              longitude: address.longitude
            })
          }
        });


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

      $scope.removeAddress = function(id){
        $http.delete('/address/' + id).success(function (data) {
          $location.path('/home');
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

function round(x, digits){
  return parseFloat(x.toFixed(digits))
}
