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

        $scope.app_initPurAmt = null;
        $scope.app_income = null;
        $scope.app_firstName = null;
        $scope.app_middleName = null;
        $scope.app_lastName = null;
        $scope.app_suffix = null;
        $scope.app_dob = null;
        $scope.app_ssn = null;

        $scope.app_housetype = null;
        $scope.app_address = null;
        $scope.app_apt = null;
        $scope.app_city = null;
        $scope.app_state = null;
        $scope.app_zip = null;

        $scope.app_phone = null;
        $scope.app_email = null;


        $scope.autoPayName = null
        $scope.autoPay_routing = null;
        $scope.autoPay_bankacct = null;
        $scope.autoPay_cardnum = null;
        $scope.autoPay_expiration = null;
        $scope.autoPay_securityCode = null;




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