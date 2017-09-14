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

    .directive('ccBannerCustomer', [ 'CFService',function (CFService) {
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
            'customer_businessTypeDropdownSelected': '',
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

            'customer_': '',
            'us_all_state': ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"],
            'test': null
        };
        return self;
    });