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
        $ctrlView3.myModalContentWClientPopup = function () {
            var modalInstance = $uibModal.open({
                animation: $ctrlView3.animationsEnabled,
                component: 'myModalContentWClientPopup',
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

        $scope.goToWorkListAppView = function () {
            $scope.cfServiceFFS.ffsView = "ffs_worklist_app_view";
        };

        $scope.goToWorkListAppViewProfile = function () {
            $scope.cfServiceFFS.ffsView = "ffs_worklist_app_view_profile";
        };

        $scope.goToFFSVehicleListView = function () {
            $scope.cfServiceFFS.ffsView = "ffs_worklist_app_view_vehicle_list";
        };

        $scope.goToFFSVehicleView = function () {
            $scope.cfServiceFFS.ffsView = "ffs_worklist_app_view_vehicle";
        };

        $scope.addPrevAddressInd = function () {
            $scope.cfServiceFFS.customer_indGuarantorAddressPreFlag = 'Y';
        };

        $scope.delPrevAddressInd = function () {
            $scope.cfServiceFFS.customer_indGuarantorAddressPreFlag = 'N';
        };

        $scope.coApplicantFlagOn = function () {
            $scope.cfServiceFFS.customer_indAddCoApplicantFlag = true;
        };

        $scope.coApplicantFlagOff = function () {
            $scope.cfServiceFFS.customer_indAddCoApplicantFlag = false;
        };

        $scope.prevEmpFlagOn = function () {
            $scope.cfServiceFFS.customer_indAddPrevEmpFlag = true;
        };

        $scope.prevEmpFlagOff = function () {
            $scope.cfServiceFFS.customer_indAddPrevEmpFlag = false
        };
        
        $scope.appUploadImg = function() {
            console.log("uploagImg $scope.cfServiceFFS.appImage: " + $scope.cfServiceFFS.appImage );
            if($scope.cfServiceFFS.appImage){
                console.log("appImage: " + $scope.cfServiceFFS.appImage);
                $scope.cfServiceFFS.appImageList.unshift($scope.cfServiceFFS.appImage);
                $scope.cfServiceFFS.appImage = null;
            }
        };
    
        $scope.appResetImg = function() {
            $scope.cfServiceFFS.appImage = null;
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
.component('myModalContentWClientPopup', {
        templateUrl: 'myModalContentWClientPopup.html',
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
    //  ffs_clients         ffs_reports      ffs_worklist_app_view    ffs_worklist  ffs_worklist_app_view
    // ffs_worklist_app_view_profile ffs_worklist_app_view_vehicle_list
    // ffs_worklist_app_view_vehicle
        var self = {
            'currentUserData': {},
            'loginFlag': false,
            'ffsView': 'ffs_worklist',
            'ffsViewAuthCheckFlag': false,
            'appImage': null,
            'appImageList':[],
            //
            'customer_indFirstName': 'Francis',
            'customer_indLastName': 'Saquella',
            'customer_indMI': 'F',
            'customer_indEmail': 'Saquella@yahoo.com',
            'customer_indPassword': '321321321',
            'customer_indConfirmPassword': '321321321',
            'customer_indGuarantorSSN': 'xxx-xx-9089',
            'customer_indGuarantorDOB': '1972-10-11',
            'customer_indGuarantorDriverLicense': 'DI319832Y8',
            'customer_indGuarantorDriverLicState': 'TN',
            'customer_indGuarantorHomePhone': '432-234-4343',
            'customer_indGuarantorCellPhone': '435-224-2321',

            'customer_indGuarantorAddress1': '1623 Main St',
            'customer_indGuarantorAddress2': '',
            'customer_indGuarantorAddressCity': 'Tampa',
            'customer_indGuarantorAddressState': 'FL',
            'customer_indGuarantorAddressZip': '33601',
            'customer_indGuarantorAddressLivedYrs': '2008-02-13',
            'customer_indGuarantorAddressLivedMos': '10',
            'customer_indGuarantorAddressMortgageHolder': 'James Legstrong',
            'customer_indGuarantorAddressMonthlyMortgagePayment': '1,800.00',
            'customer_indGuarantorAddressPreFlag': 'N',
            'customer_indGuarantorAddress1Pre': '',
            'customer_indGuarantorAddress2Pre': '',
            'customer_indGuarantorAddressCityPre': '',
            'customer_indGuarantorAddressStatePre': '',
            'customer_indGuarantorAddressZipPre': '',
            'customer_indGuarantorAddressLivedYrsPre': '',
            'customer_indRentOrOwnFlag': 'R',
            'customer_indRentOrOwnFlagPre': 'R',
            'customer_indGuarantorAddressLivedMosPre': '',
            'customer_indGuarantorAddressMortgageHolderPre': '',
            'customer_indGuarantorAddressMonthlyMortgagePaymentPre': '',

            'customer_indClosetName': 'Cisco Babber',
            'customer_indCloseRelationship': 'Uncle',
            'customer_indPhone': '432-987-2098',

            'customer_indEmpName': 'DUPONT',
            'customer_indEmpPosition': 'Account Manager',
            'customer_indEmpWorkedSince': '2002-01-07',
            'customer_indEmpPhone': '302-217-0987',
            'customer_indEmpAddressLine1': '322 Main St',
            'customer_indEmpAddressLine2': '',
            'customer_indEmpCity': 'Wilmington',
            'customer_indEmpState': 'DE',
            'customer_indEmpZip': '19801',
            'customer_indEmpIncome': '98,000.00',
            'customer_indEmpOtherIncome': '5,200.00',

            'customer_indEmpNamePrev': '',
            'customer_indEmpPositionPrev': '',
            'customer_indEmpWorkedSincePrev': '',
            'customer_indEmpPhonePrev': '',
            'customer_indEmpAddressLine1Prev': '',
            'customer_indEmpAddressLine2Prev': '',
            'customer_indEmpCityPrev': '',
            'customer_indEmpStatePrev': '',
            'customer_indEmpZipPrev': '',

            'customer_indVehMake': 'Alfa Romeo',
            'customer_indVehModel': 'Giulia',
            'customer_indVehYear': '2016',
            'customer_indVehFinancedBy': 'Bank of SuperRich',
            'customer_indVehTerm': '48',
            'customer_indVehPayment': '572.28',
            'customer_indVehRepossessedFlag': 'N',
            'customer_indVehSuitsFlag': 'N',
            'customer_indVehBankruptcyFlag': 'N',

            'customer_indCoAppPurchaserName': 'Belkin Smith',
            'customer_indCoAppRelationship': 'Uncle',
            'customer_indCoAppSSN': 'xxx-xx-7653',
            'customer_indCoAppDOB':'1968-03-13',
            'customer_indCoAppPhone':'432-098-9966',

            'customer_indCoAppAddAddressLine1': '210 South College Ave',
            'customer_indCoAppAddAddressLine2': '',
            'customer_indCoAppAddCity': 'Newark',
            'customer_indCoAppAddState': 'DE',
            'customer_indCoAppAddZip': '19716',
            'customer_indCoAppAddSince': '2005-01-07',

            'customer_indCoAppAddEmpName':'Freelance',
            'customer_indCoAppAddEmpPosition':'Owner',
            'customer_indCoAppAddEmpWorkedSince':'1999-6-12',
            'customer_indCoAppAddEmpPhone':'321-932-2121',
            'customer_indCoAppAddEmpAddr1':'1100 N King St',
            'customer_indCoAppAddEmpAddr2':'',
            'customer_indCoAppAddEmpCity':'Wilmington',
            'customer_indCoAppAddEmpState':'DE',
            'customer_indCoAppAddEmpZip':'19884',


            'customer_indCoAppIncome':'150,000.00',
            'customer_indCoAppOtherIncome':'12,000.00',

            'customer_indAddCoApplicantFlag': false,
            'customer_indAddPrevEmpFlag': false,

            //
            'ffs_': '',
            'us_all_state': ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"],
            'test': null
        };
        return self;
});