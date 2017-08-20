'use strict';

angular.module('myApp.view1', [
    'ngRoute',
    'mgcrea.ngStrap',
    'ngAnimate',
    'toaster',
    'angularSpinner',
    'angular-ladda'
])

    .config(['$routeProvider', 'laddaProvider', function($routeProvider, laddaProvider) {
        /*
         laddaProvider
         spinnerSize: 35,
         spinnerColor: '#ffffff'
         */

        laddaProvider.setOption({
            style: 'expand-right'
        });



        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'RegisterCtrl'
        });
    }])
    .controller('RegisterCtrl', [ '$scope', '$location', '$modal', 'usSpinnerService', 'CFService', function($scope, $location, $modal, usSpinnerService, CFService) {
        $scope.cfService = CFService;

        $scope.showBureauModal = function () {
            $scope.createModal = $modal({
                scope: $scope,
                template: 'view1/templates/modal.bureau.tpl.html',
                show: true
            });
        };

        $scope.showCreateModal = function () {
            $scope.createModal = $modal({
                scope: $scope,
                template: 'view1/templates/modal.offers.tpl.html',
                show: true
            });
        };

        $scope.showAutoPayModal = function () {
            $scope.createModal.hide();
            $scope.createModal = $modal({
                scope: $scope,
                template: 'view1/templates/modal.autopay.tpl.html',
                show: true
            });
        };
    }])
    .directive('ccSpinner', function () {
        return {
            'restrict': 'AEC',
            'templateUrl': "view1/templates/spinner.html",
            'scope': {
                'isLoading': '=',
                'message': '@'
            }
        };
    })

    .service('CFService', function ($http, toaster, $q) {
        var self = {
            'step1Complete': null,
            'step2Complete': null,
            'step3Complete': null,
            'step4Complete': null,
            'autoPayType': null
        };
        return self;
    });