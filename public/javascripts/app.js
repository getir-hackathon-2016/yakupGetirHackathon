'use strict';

var app = angular.module('myApp', ['ngRoute', 'uiGmapgoogle-maps']);


app.config(['$routeProvider', 'uiGmapGoogleMapApiProvider', function ($routeProvider, uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
      }),
      $routeProvider.when('/home', {
            templateUrl: 'views/home.html',
            controller: 'HomeController'
      }).
      when('/maps', {
        templateUrl: 'views/maps/maps.html',
        controller: 'MapsController'
      }).
      when('/address', {
        templateUrl: 'views/address/address.html',
        controller: 'AddressController'
      }).
      when('/products', {
        templateUrl: 'views/products/products.html',
        controller: 'ProductController'
      }).
      when('/cart', {
        templateUrl: 'views/carts/cart.html',
        controller: 'CartController'
      }).
      otherwise({redirectTo: '/home'});
}]);
