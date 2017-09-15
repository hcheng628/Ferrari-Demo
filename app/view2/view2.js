'use strict';

angular.module('myApp.view2', [
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

        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'RegisterCtrl2'
        });
    }])
    .controller('RegisterCtrl2', ['$scope', '$location', '$modal', 'usSpinnerService', 'CFService', function ($scope, $location, $modal, usSpinnerService, CFService) {
        $scope.cfService = CFService;

        $scope.customerViewAuthCheck = function () {
            console.log('customerViewAuthCheck init');
            if(Parse.User.current()){
                if(Parse.User.current().get('ferrariDemoParty') == 'Individual' || Parse.User.current().get('ferrariDemoParty') == 'Business'){
                    $scope.cfService.customerViewAuthCheckFlag =  true;
                    $scope.cfService.customer_IndOrBusFlag = Parse.User.current().get('ferrariDemoParty');

                }else {
                    $scope.cfService.customerViewAuthCheckFlag = false;
                    // Not Auth for this
                }
            }else{
                // Please Login!!!
                $location.path('auth');
            }
        };
        
        $scope.addPrevAddress = function () {
            $scope.cfService.customer_companyGuarantorAddressPreFlag = 'Y';
        };

        $scope.delPrevAddress = function () {
            $scope.cfService.customer_companyGuarantorAddressPreFlag = 'N';
        };

        $scope.addPrevAddressInd = function () {
            $scope.cfService.customer_indGuarantorAddressPreFlag = 'Y';
        };

        $scope.delPrevAddressInd = function () {
            $scope.cfService.customer_indGuarantorAddressPreFlag = 'N';
        };

        // 'customer_indAddCoApplicantFlag': false,
        //     'customer_indAddPrevEmpFlag': false,


        $scope.coApplicantFlagOn = function () {
            $scope.cfService.customer_indAddCoApplicantFlag = true;
        };

        $scope.coApplicantFlagOff = function () {
            $scope.cfService.customer_indAddCoApplicantFlag = false;
        };

        $scope.prevEmpFlagOn = function () {
            $scope.cfService.customer_indAddPrevEmpFlag = true;
        };

        $scope.prevEmpFlagOff = function () {
            $scope.cfService.customer_indAddPrevEmpFlag = false
        };


        $scope.goToConsumerSummaryView = function () {
            console.log("goToConsumerSummaryView..... ");
        };

        $scope.goToConsumerProfileView = function () {
            console.log("goToConsumerProfileView..... ");
        };

        $scope.goToConsumerVehicleView = function () {
            console.log("goToConsumerVehicleView..... ");
        };

        $scope.goToConsumerFinanceView = function () {
            console.log("goToConsumerFinanceView..... ");
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
            'templateUrl': "view2/templates/spinner.html",
            'scope': {
                'isLoading': '=',
                'message': '@'
            }
        };
    })

    .directive('ccBannerCustomer', [ 'CFService', '$location', '$timeout',function (CFService, $location,$timeout) {
        return {
            'templateUrl': "view2/templates/banner.html",
            link: function (scope) {
                scope.cfService = CFService;

                scope.goToConsumerSummaryView = function () {
                    scope.cfService.customerView = 'customer_summary';
                    console.log("goToConsumerSummaryView..... " + scope.cfService.customerView);
                };

                scope.goToConsumerProfileView = function () {
                    scope.cfService.customerView = 'customer_profile';
                    console.log("goToConsumerProfileView..... " + scope.cfService.customerView);
                };

                scope.goToConsumerVehicleView = function () {
                    scope.cfService.customerView = 'customer_vehicle';
                    console.log("goToConsumerVehicleView..... " + scope.cfService.customerView);
                };

                scope.goToConsumerFinanceView = function () {
                    scope.cfService.customerView = 'customer_finance';
                    console.log("goToConsumerFinanceView..... " + scope.cfService.customerView);
                };

                scope.goToConsumerFinanceView = function () {
                    scope.cfService.customerView = 'customer_finance';
                    console.log("goToConsumerFinanceView..... " + scope.cfService.customerView);
                };

                scope.customerLogout = function () {
                    console.log("customerLogout");
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
    .service('CFService', function ($http, toaster, $q) {
        var self = {
            'loginFlag': false,
            'userParty': 'customer',
            'customerView': 'customer_summary',
            'customer_companyName': 'Sample Company',
            'customer_email': 'business@business.com',
            'customer_password': 'password',
            'customer_passwordConfirm': 'password',
            'customer_businessNature': 'Manufacture',
            'customer_businessPhone': '304-225-9872',
            'customer_yearsEstablised': '15',
            'customer_businessTypeDropdown': ['Incorporation', 'C Corporation', 'Proprietorship', 'Partnership', 'S Corporation', 'LLC' ],
            'customer_businessTypeDropdownSelected': 'Proprietorship',
            'customer_companyAddrLine1': '1708 Lakewood Dr NE',
            'customer_companyAddrLine2': '',
            'customer_companyCity': 'Houston',
            'customer_companyState': 'TX',
            'customer_companyZip': '77001',
            'customer_companyYrsUnderPresendOwnership': '15',
            'customer_companyDunFlag':'Y',
            'customer_companyDunNum': '123321',
            'customer_companyTaxId': '321-321-3211',
            'customer_companyRepossessedFlag': 'Y',
            'customer_companySuitsFlag': 'Y',
            'customer_companyBankruptcyFlag': 'N',
            'customer_companyAffiliateName': 'Sample Affilliate',
            'customer_companyAffiliateAddress1': '1510 Polk St',
            'customer_companyAffiliateAddress2': '',
            'customer_companyAffiliateCity': 'Houston',
            'customer_companyAffiliateState': 'TX',
            'customer_companyAffiliateZip': '77002',

            'customer_companyOffcerName1': 'Crif Moka',
            'customer_companyOffcerTitle1': 'CFO',
            'customer_companyOffcerOwnership1': '45%',
            'customer_companyOffcerYrsWithCompany1': '15',
            'customer_companyOffcerName2': 'Illy Press',
            'customer_companyOffcerTitle2': 'CEO',
            'customer_companyOffcerOwnership2': '55%',
            'customer_companyOffcerYrsWithCompany2': '12',

            'customer_companyBankName': 'Wells Fargo',
            'customer_companyBankAddress1': '420 Montgomery Street',
            'customer_companyBankAddress2': '',
            'customer_companyBankCity': 'San Francisco',
            'customer_companyBankState': 'CA',
            'customer_companyBankZip': '94104',
            'customer_companyBankPhone': '800-869-3557',
            'customer_companyBankLoanOfficer': 'Extremely Rich',
            'customer_companyBankAcctBalance': '9,000,000.00',
            'customer_companyBankAcctType': ['Checking', 'Loan', 'Saving'],
            'customer_companyBankAcctTypeSelected': 'Loan',
            'customer_companyBankAcctNum': '321-321321-312',

            'customer_companyGuarantorFirstName': 'Francis',
            'customer_companyGuarantorLastName': 'Saquella',
            'customer_companyGuarantorMI': 'C',
            'customer_companyGuarantorEmail': 'Francis@gmail.com',
            'customer_companyGuarantorSSN': 'xxx-xx-9089',
            'customer_companyGuarantorDOB': '1972-10-11',
            'customer_companyGuarantorDriverLicense': 'DI319832Y8',
            'customer_companyGuarantorDriverLicState': 'TN',
            'customer_companyGuarantorHomePhone': '432-234-4343',
            'customer_companyGuarantorCellPhone': '435-224-2321',
            'customer_companyGuarantorAddress1': '1623 Main St',
            'customer_companyGuarantorAddress2': '',
            'customer_companyGuarantorAddressCity': 'Tampa',
            'customer_companyGuarantorAddressState': 'FL',
            'customer_companyGuarantorAddressZip': '33601',
            'customer_companyGuarantorAddressLivedYrs': '2008-02-13',
            'customer_companyGuarantorAddressLivedMos': '10',
            'customer_companyGuarantorAddressMortgageHolder': 'James Legstrong',
            'customer_companyGuarantorAddressMonthlyMortgagePayment': '1,800.00',
            'customer_companyGuarantorAddressPreFlag': 'N',
            'customer_companyGuarantorAddress1Pre': '',
            'customer_companyGuarantorAddress2Pre': '',
            'customer_companyGuarantorAddressCityPre': '',
            'customer_companyGuarantorAddressStatePre': '',
            'customer_companyGuarantorAddressZipPre': '',
            'customer_companyGuarantorAddressLivedYrsPre': '',
            'customer_companyGuarantorAddressLivedMosPre': '',
            'customer_companyGuarantorAddressMortgageHolderPre': '',
            'customer_companyGuarantorAddressMonthlyMortgagePaymentPre': '',

            'customer_companyGuarantorEmpName': 'Super Race Company',
            'customer_companyGuarantorEmpTitle': 'Designated Driver',
            'customer_companyGuarantorEmpYrs': '2006-06-15',
            'customer_companyGuarantorEmpMos': '2',
            'customer_companyGuarantorEmpPhone': '321-321-3212',
            'customer_companyGuarantorEmpAddress1': '3210 Berkeley LN',
            'customer_companyGuarantorEmpAddress2': '',
            'customer_companyGuarantorEmpCity': 'Tampa',
            'customer_companyGuarantorEmpState': 'FL',
            'customer_companyGuarantorEmpZip': '33601',

            'customer_companyGuarantorSalary': '90,000.00',
            'customer_companyGuarantorOtherIncome': '100,000.00',

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


            'customer_indVeh': '',
            'customerViewAuthCheckFlag': false,
            'customer_IndOrBusFlag': '',
            'customer_': '',
            'us_all_state': ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"],
            'test': null
        };
        return self;
    });