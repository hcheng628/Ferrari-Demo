'use strict';
angular.module('myApp.view3', [
    'ngRoute',
    'ngAnimate',
    'toaster',
    'angularSpinner',
    'angular-ladda',
    'jcs-autoValidate',
    'ui.mask',
    'ngFileUpload',
    'ui.bootstrap',
    'ngSanitize'
])
.config(['$routeProvider', 'laddaProvider', function ($routeProvider, laddaProvider) {
    laddaProvider.setOption({
        style: 'expand-right'
    });
    $routeProvider.when('/view3', {
        templateUrl: 'view3/view3.html',
        controller: 'View3Ctrl'
   });
}])
.controller('View3Ctrl', ['$scope', '$location', '$document', '$uibModal', 'usSpinnerService', 'CFServiceFFS', '$log', function ($scope, $location, $document, $uibModal, usSpinnerService, CFServiceFFS, $log) {
        var $ctrlView3 = this;
        $ctrlView3.items = ['item1', 'item2', 'item3'];
        $ctrlView3.animationsEnabled = true;
        $ctrlView3.openComponentModalI = function () {
            var modalInstance = $uibModal.open({
                animation: $ctrlView3.animationsEnabled,
                component: 'modalComponentI',
                resolve: {
                    items: function () {
                        return $ctrlView3.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $ctrlView3.selected = selectedItem;
            }, function () {
                $log.info('modal-component dismissed at: ' + new Date());
            });
        };
        $ctrlView3.openComponentModalW = function () {
            var modalInstance = $uibModal.open({
                animation: $ctrlView3.animationsEnabled,
                component: 'modalComponentW',
                resolve: {
                    items: function () {
                        return $ctrlView3.items;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $ctrlView3.selected = selectedItem;
            }, function () {
                $log.info('modal-component dismissed at: ' + new Date());
            });
        };
        $ctrlView3.myModalContentMakePayment = function () {
            var modalInstance = $uibModal.open({
                animation: $ctrlView3.animationsEnabled,
                component: 'myModalContentMakePayment',
                resolve: {
                    items: function () {
                        return $ctrlView3.items;
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                $ctrlView3.selected = selectedItem;
            }, function () {
                $log.info('modal-component dismissed at: ' + new Date());
            });
        };

        $scope.cfServiceFFS = CFServiceFFS;
        $scope.ffsViewAuthCheck = function () {
            console.log('ffsViewAuthCheck init');
            if(Parse.User.current()){
                if(Parse.User.current().get('ferrariDemoParty') == 'FFS'){
                    $scope.cfServiceFFS.ffsViewAuthCheckFlag =  true;
                    $scope.cfServiceFFS.currentUserData.username = Parse.User.current().get('username');
                    $scope.cfServiceFFS.currentUserData.ferrariDemoParty = 'FFS';
                    console.log(JSON.stringify($scope.cfServiceFFS.currentUserData));
                }else {
                    $scope.cfServiceFFS.ffsViewAuthCheckFlag = false;
                    // Not Auth for this
                }
            }else{
                // Please Login!!!
                $location.path('auth');
            }
        };

        $scope.doFfsAppAppView = function () {
            $scope.cfServiceFFS.ffsView = "ffs_app";
        };
}])
.controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
        var $ctrlView3 = this;
        $ctrlView3.items = items;
        $ctrlView3.selected = {
            item: $ctrlView3.items[0]
        };

        $ctrlView3.ok = function () {
            $uibModalInstance.close($ctrlView3.selected.item);
        };

        $ctrlView3.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
})
.component('modalComponentI', {
        templateUrl: 'myModalContentI.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function () {
            var $ctrlView3 = this;

            $ctrlView3.$onInit = function () {
                $ctrlView3.items = $ctrlView3.resolve.items;
                $ctrlView3.selected = {
                    item: $ctrlView3.items[0]
                };
            };

            $ctrlView3.ok = function () {
                $ctrlView3.close({$value: $ctrlView3.selected.item});
            };

            $ctrlView3.cancel = function () {
                $ctrlView3.dismiss({$value: 'cancel'});
            };
        }
})
.component('modalComponentW', {
        templateUrl: 'myModalContentW.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function () {
            var $ctrlView3 = this;

            $ctrlView3.$onInit = function () {
                $ctrlView3.items = $ctrlView3.resolve.items;
                $ctrlView3.selected = {
                    item: $ctrlView3.items[0]
                };
            };

            $ctrlView3.ok = function () {
                $ctrlView3.close({$value: $ctrlView3.selected.item});
            };

            $ctrlView3.cancel = function () {
                $ctrlView3.dismiss({$value: 'cancel'});
            };
        }
})
.component('myModalContentMakePayment', {
        templateUrl: 'myModalContentMakePayment.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function () {
            var $ctrlView3 = this;

            $ctrlView3.$onInit = function () {
                $ctrlView3.items = $ctrlView3.resolve.items;
                $ctrlView3.selected = {
                    item: $ctrlView3.items[0]
                };
            };

            $ctrlView3.ok = function () {
                $ctrlView3.close({$value: $ctrlView3.selected.item});
            };

            $ctrlView3.cancel = function () {
                $ctrlView3.dismiss({$value: 'cancel'});
            };
        }
})
.directive('ccSpinner', function () {
        return {
            'restrict': 'AEC',
            'templateUrl': "view3/templates/spinner.html",
            'scope': {
                'isLoading': '=',
                'message': '@'
            }
        };
})
.directive('ccBannerFfs', [ 'CFServiceFFS', '$location', '$timeout',function (CFServiceFFS, $location,$timeout) {
        return {
            'templateUrl': "view3/templates/banner.html",
            link: function (scope) {
                scope.cfServiceFFS = CFServiceFFS;
                scope.goToFFSWorklist = function () {
                    scope.cfServiceFFS.ffsView = 'ffs_worklist';
                    console.log("goToFFSWorklist..... " + scope.cfServiceFFS.ffsView);
                };

                scope.goToFFSClients = function () {
                    scope.cfServiceFFS.ffsView = 'ffs_clients';
                    console.log("goToFFSClients..... " + scope.cfServiceFFS.ffsView);
                };

                scope.goToFFSReports = function () {
                    scope.cfServiceFFS.ffsView = 'ffs_reports';
                    console.log("goToFFSReports..... " + scope.cfServiceFFS.ffsView);
                };

                scope.ffsLogout = function () {
                    console.log("ffsLogout");
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
.filter('array', function() {
        return function(input) {
            //console.log(input);
            return input.join(', ');
        };
})
.service('CFServiceFFS', function ($http, toaster, $q) {
    //  ffs_clients ffs_reports ffs_worklist
        var self = {
            'currentUserData': {},
            'loginFlag': false,
            'ffsView': 'ffs_worklist',
            'ffsViewAuthCheckFlag': false,
            'ffs_': '',
            'us_all_state': ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"],
            'test': null
        };
        return self;
});