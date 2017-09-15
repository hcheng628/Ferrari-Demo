'use strict';
angular.module('myApp.auth', [
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

        $routeProvider.when('/auth', {
            templateUrl: 'auth/auth.html',
            controller: 'RegisterCtrlAuth'
        });
    }])
    .controller('RegisterCtrlAuth', ['$scope', '$location', '$modal', 'usSpinnerService', 'AuthCFService', '$timeout', function ($scope, $location, $modal, usSpinnerService, AuthCFService, $timeout) {
        $scope.authcfService = AuthCFService;

        $scope.goToLogin = function () {
            $scope.authcfService.auth_current_view = 'login';
        };

        $scope.goToRegister = function () {
            $scope.authcfService.auth_current_view = 'register';

        };

        $scope.goToPasswordReset = function () {
            $scope.authcfService.auth_current_view = 'reset';

        };
        $scope.doLogin = function () {
            $scope.authcfService.loginFlag = true;
            // $routeProvider.otherwise({redirectTo: '/view2'});
            Parse.User.logIn($scope.authcfService.auth_login_username.toLowerCase(),$scope.authcfService.auth_login_password).then(
                function(success){
                    // console.log("Login Success: " + JSON.stringify(success, undefined, 2));
                    // console.log("Current User:" + JSON.stringify(Parse.User.current(), undefined, 2));
                    var whichParty = Parse.User.current().get('ferrariDemoParty');
                    if(whichParty == 'Business' || whichParty == 'Individual'){
                        $timeout(function(){
                            console.log("Go to Customer");
                            $location.path('view2');
                        },1);
                    } else if (whichParty == 'Appraisal'){
                        $timeout(function(){
                            console.log("Go to Appraisal");
                            $location.path('view1');
                        },1);
                    }
                },
                function (error) {
                    console.error(error);
                }
            );

        };

        // $scope.goToView = function (partyView) {
        //     $location.path('view1');
        //     alert(partyView);
        //     if(whichParty == 'Business' || whichParty == 'Individual'){
        //         console.log("Go to Customer");
        //         $location.path('view2');
        //     } else if (whichParty == 'Appraisal'){
        //         console.log("Go to Appraisal");
        //         $location.path('view1');
        //     }
        // };

        $scope.doRegister = function () {
            var newUser = new Parse.User();
            var lowerCaseUsername = $scope.authcfService.auth_register_username.toLowerCase();
            newUser.set("username", lowerCaseUsername);
            newUser.set("ferrariDemoParty", $scope.authcfService.auth_register_partySelected);
            newUser.set("password", $scope.authcfService.auth_register_password);
            newUser.set("email", lowerCaseUsername);
            newUser.signUp().then(
                function (success) {
                    console.log("Success signUp: " + JSON.stringify(success, null, 2));
                },
                function (error) {
                    console.error("Failed signUp: " + JSON.stringify(error, null, 2));
                }
            );
        };
        
        $scope.doResetPassword = function () {
            Parse.User.requestPasswordReset($scope.authcfService.auth_reset_username).then(
                function (success) {
                console.log("Success requestPasswordReset: " + JSON.stringify(success, null, 2));
                },
                function (error) {
                console.error("Failed requestPasswordReset: " + JSON.stringify(error, null, 2));
                }
            );
        };
        
    }])
    .directive('ccSpinner', function () {
        return {
            'restrict': 'AEC',
            'templateUrl': "auth/templates/spinner.html",
            'scope': {
                'isLoading': '=',
                'message': '@'
            }
        };
    })
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
    .service('AuthCFService', function ($http, toaster, $q) {
        var self = {
            'auth_current_view': 'login',
            'auth_login_username': 'H.Cheng@criflending.com',
            'auth_login_password': 'password',
            'auth_register_username': '',
            'auth_register_party': ['Individual', 'Business'],
            'auth_register_partySelected': '',
            'auth_register_password': '',
            'auth_reset_username':'',
            'loginFlag': false,
            'step1Complete': null,
            'step2Complete': null,
            'step3Complete': null,
            'step4Complete': null,
            'autoPayType': null,
            'test': null
        };
        return self;
    });