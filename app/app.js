'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  '720kb.datepicker',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.auth',
  'myApp.version'
])
.run(function () {
    console.log("Init App");
    Parse.initialize("appidCheng628");
    Parse.serverURL = 'https://parse-server-cheng.herokuapp.com/parse';
})
.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/auth'});
}]);
