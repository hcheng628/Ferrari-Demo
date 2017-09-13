'use strict';

angular.module('myApp.view1', [
    'ngRoute',
    'mgcrea.ngStrap',
    'ngAnimate',
    'toaster',
    'angularSpinner',
    'angular-ladda',
    'jcs-autoValidate',
    'ui.mask',
    'ngFileUpload'
])
    .run([
        'bootstrap3ElementModifier',
        function (bootstrap3ElementModifier) {
            bootstrap3ElementModifier.enableValidationStateIcons(true);
        }])

    .config(['$routeProvider', 'laddaProvider', function ($routeProvider, laddaProvider) {

        laddaProvider.setOption({
            style: 'expand-right'
        });

        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'RegisterCtrl'
        });
    }])
    .controller('RegisterCtrl', ['$scope', '$location', '$modal', 'usSpinnerService', 'CFService', function ($scope, $location, $modal, usSpinnerService, CFService) {
        $scope.cfService = CFService;
        // $scope.$watch('app_ssn', function(val, oldVal) {
        //     console.log('app_ssn= \'' + val + '\'');
        // });
        //
        // $scope.$watch('testForm.$valid', function(val, oldVal) {
        //     console.log('$watch testForm.$valid ' + val);
        // });


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

        $scope.doLogin = function () {
            alert("We know you very well! Mr. Putyatin!")
            $scope.cfService.loginFlag = true;
        };

        $scope.doAppAppView = function () {
            console.log("doAppAppView.....");
            $scope.cfService.appraiseView = "app_app";
        };

        $scope.appUploadImg = function() {
            console.log("uploagImg $scope.cfService.appImage: " + $scope.cfService.appImage );
            if($scope.cfService.appImage){
                console.log("appImage: " + $scope.cfService.appImage);
                $scope.cfService.appImageList.unshift($scope.cfService.appImage);
                $scope.cfService.appImage = null;
            }
        };

        $scope.appResetImg = function() {
            $scope.cfService.appImage = null;
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

    .directive('ccBanner', [ 'CFService',function (CFService) {
        return {
            'templateUrl': "view1/templates/banner.html",
            link: function (scope) {
                scope.cfService = CFService;
                scope.goToAppraiseMainView = function () {
                    scope.cfService.appraiseView = 'app_main';
                };
                scope.goToAppraiseSearchView = function () {
                    scope.cfService.appraiseView = 'app_search';

                };
            },
            'scope': {
                'isLoading': '=',
                'message': '@'
            }
        };
    }])

    .directive('validateSsn', function () {
        var SSN_REGEXP = /^(?!000)(?!666)(?!9)\d{3}[- ]?(?!00)\d{2}[- ]?(?!0000)\d{4}$/;
        var ssnPattern = {
            3: '-',
            5: '-'
        };
        return {
            require: 'ngModel',
            link: function (scope, elem, attr, ctrl) {
                var formatSSN = function () {
                    console.log("Chengcheng");
                    var sTempString = ctrl.$viewValue;
                    sTempString = sTempString.replace(/\-/g, '');
                    var numbers = sTempString;
                    var temp = '';
                    for (var i = 0; i < numbers.length; i++) {
                        temp += (ssnPattern[i] || '') + numbers[i];
                    }
                    ctrl.$viewValue = temp;

                    scope.$apply(function () {
                        elem.val(ctrl.$viewValue);
                    });

                };
                ctrl.$parsers.unshift(function (viewValue) {
                    // test and set the validity after update.
                    var valid = SSN_REGEXP.test(viewValue);
                    ctrl.$setValidity('ssnValid', valid);
                    return viewValue;
                });
                // This runs when we update the text field
                ctrl.$parsers.push(function (viewValue) {

                    var valid = SSN_REGEXP.test(viewValue);
                    ctrl.$setValidity('ssnValid', valid);
                    return viewValue;
                });
                elem.bind('blur', formatSSN);

            }
        };
    })
    .service('CFService', function ($http, toaster, $q) {
        var self = {
            'loginFlag': false,
            'appImage': null,
            'appImageList': [],
            'userParty': 'appraise',
            'appraiseView': 'app_main',
            'step1Complete': null,
            'step2Complete': null,
            'step3Complete': null,
            'step4Complete': null,
            'autoPayType': null,
            'test': null
        };
        return self;
    });