'use strict';

angular.module('myApp.view1', [
    'ngRoute',
    'mgcrea.ngStrap',
    'ngAnimate',
    'toaster',
    'angularSpinner',
    'angular-ladda',
    'jcs-autoValidate'
])
    .run([
        'bootstrap3ElementModifier',
        function (bootstrap3ElementModifier) {
            bootstrap3ElementModifier.enableValidationStateIcons(true);
        }])

    .config(['$routeProvider', 'laddaProvider', function($routeProvider, laddaProvider) {

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

        var app_initPurAmt = 809.00;
        var app_income = null;
        var app_firstName = "Ciao";
        var app_middleName = "Di";
        var app_lastName = "Bella";
        var app_suffix = null;
        var app_dob = null;
        var app_ssn = null;

        var app_housetype = null;
        var app_address = null;
        var app_apt = null;
        var app_city = null;
        var app_state = null;
        var app_zip = null;

        var app_phone = null;
        var app_email = null;


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
            'autoPayType': null,
            'test': null
        };
        return self;
    });