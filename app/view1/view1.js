'use strict';

angular.module('myApp.view1', [
    'ngRoute',
    'ngAnimate',
    'toaster',
    'angularSpinner',
    'angular-ladda',
    'jcs-autoValidate',
    'ui.mask',
    'ngFileUpload'
])
    .run(
        // [
        // 'bootstrap3ElementModifier',
        // function (bootstrap3ElementModifier) {
        //     bootstrap3ElementModifier.enableValidationStateIcons(true);
        //     // Parse.initialize("appidCheng628");
        //     // Parse.serverURL = 'https://parse-server-cheng.herokuapp.com/parse';
        // }
        // ]
    )

    .config(['$routeProvider', 'laddaProvider', function ($routeProvider, laddaProvider) {

        laddaProvider.setOption({
            style: 'expand-right'
        });

        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'RegisterCtrl'
        });
    }])
    .controller('RegisterCtrl', ['$scope', '$location', 'usSpinnerService', 'AppCFService', '$timeout', function ($scope, $location, usSpinnerService, AppCFService, $timeout) {
        $scope.appcfService = AppCFService;
        // $scope.$watch('app_ssn', function(val, oldVal) {
        //     console.log('app_ssn= \'' + val + '\'');
        // });
        //
        // $scope.$watch('testForm.$valid', function(val, oldVal) {
        //     console.log('$watch testForm.$valid ' + val);
        // });

        $scope.appViewAuthCheck = function () {
            console.log('appViewAuthCheck init');
            if(Parse.User.current()){
                if(Parse.User.current().get('ferrariDemoParty') == 'Appraisal'){
                    $scope.appcfService.appViewAuthCheckFlag =  true;
                    console.log('appViewAuthCheckFlag true' + " " + $scope.appcfService.appraiseView);
                    $scope.appcfService.currentUserData.username = Parse.User.current().get('username');
                    $scope.appcfService.currentUserData.ferrariDemoParty = 'Appraisal';
                }else {
                    $scope.appcfService.appViewAuthCheckFlag = false;
                    console.log('appViewAuthCheckFlag false');
                    // Not Auth for this
                }
            }else{
                // Please Login!!!
                $location.path('auth');
            }
        };

        $scope.doAppAppView = function () {
            console.log("doAppAppView.....");
            $scope.appcfService.appraiseView = "app_app";
        };

        $scope.appUploadImg = function() {
            console.log("uploagImg $scope.appcfService.appImage: " + $scope.appcfService.appImage );
            if($scope.appcfService.appImage){
                console.log("appImage: " + $scope.appcfService.appImage);
                $scope.appcfService.appImageList.unshift($scope.appcfService.appImage);
                $scope.appcfService.appImage = null;
            }
        };

        $scope.appResetImg = function() {
            $scope.appcfService.appImage = null;
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

    .directive('ccBanner', [ 'AppCFService', '$location', '$timeout',function (AppCFService, $location, $timeout) {
        return {
            'templateUrl': "view1/templates/banner.html",
            link: function (scope) {
                scope.appcfService = AppCFService;

                scope.goToAppraiseMainView = function () {
                    scope.appcfService.appraiseView = 'app_main';
                };
                scope.goToAppraiseSearchView = function () {
                    scope.appcfService.appraiseView = 'app_search';

                };
                scope.userLogout = function () {
                    if(Parse.User.current()){
                        Parse.User.logOut().then(
                            function (success) {
                                console.log("Success logOut: " + JSON.stringify(success, null, 2));
                                $timeout(function(){
                                    $location.path('auth');
                                },1);
                            },
                            function (error) {
                                console.error("Failed logOut: " + JSON.stringify(error, null, 2));
                            });
                    }
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
    .service('AppCFService', function ($http, toaster, $q) {
        var self = {
            'currentUserData': {},
            'appViewAuthCheckFlag': false,
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