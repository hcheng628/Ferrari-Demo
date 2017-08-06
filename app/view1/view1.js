'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'RegisterCtrl'
        });
    }])

    .controller('RegisterCtrl', [ '$scope', '$location', 'CFService', function($scope, $location, CFService) {

        $scope.cfService = CFService;
        $scope.steps = [
            'Step 1: Personal Information',
            'Step 2: Residence Information',
            'Step 3: Employment Information',
            'Step 4: Loan Information',
            'Step 5: Agreement & Verification'
        ];

        $scope.startApp = function () {
            $scope.cfService.startApp();
        };


        $scope.selection = $scope.steps[0];

        $scope.getCurrentStepIndex = function(){
            // Get the index of the current step given selection
            return _.indexOf($scope.steps, $scope.selection);
        };

        // Go to a defined step index
        $scope.goToStep = function(index) {
            if ( !_.isUndefined($scope.steps[index]) )
            {
                $scope.selection = $scope.steps[index];
            }
        };

        $scope.hasNextStep = function(){
            var stepIndex = $scope.getCurrentStepIndex();
            var nextStep = stepIndex + 1;
            // Return true if there is a next step, false if not
            return !_.isUndefined($scope.steps[nextStep]);
        };

        $scope.hasPreviousStep = function(){
            var stepIndex = $scope.getCurrentStepIndex();
            var previousStep = stepIndex - 1;
            // Return true if there is a next step, false if not
            return !_.isUndefined($scope.steps[previousStep]);
        };

        $scope.incrementStep = function() {
            if ( $scope.hasNextStep() )
            {
                var stepIndex = $scope.getCurrentStepIndex();
                var nextStep = stepIndex + 1;
                $scope.selection = $scope.steps[nextStep];
            }
        };

        $scope.decrementStep = function() {
            if ( $scope.hasPreviousStep() )
            {
                var stepIndex = $scope.getCurrentStepIndex();
                var previousStep = stepIndex - 1;
                $scope.selection = $scope.steps[previousStep];
            }
        };
    }])

    .service('CFService', function ($http) {
        var self = {
            'firstName': "",
            'lastName': "",
            'email': '',
            'ssn':'',
            'birthdate': '',
            'phone':'',
            'address': '',
            'address2':'',
            'city': '',
            'state':'',
            'zip':'',
            'houseType':'',
            'residenceSince': '',
            'mortgageRent':'',
            'bankruptcy':'',
            'employmentStatus':'',
            'employer':'',
            'employerSince':'',
            'monthlyIncome':'',
            'otherIncome':'',
            'monthlyExpenses':'',
            'loanType':'',
            'loanAmount': '',
            'externalAppId': '',
            'isSearching': false,
            'isSaving': false,
            'selectedPerson': null,
            'imagefile': null,
            'selfiefile': null,
            'selfieStr': '',
            'persons': [],
            'search': null,
            'startApp': function () {
                var endDate = new Date();
                var startResdate = new Date(self.residenceSince);
                var startEmpDate = new Date(self.employerSince);

                var numOfResMonths = endDate.getMonth() - startResdate.getMonth() + (12 * (endDate.getFullYear() - startResdate.getFullYear())) % 12;
                var numOfResYears = Math.floor(endDate.getMonth() - startResdate.getMonth() + (12 * (endDate.getFullYear() - startResdate.getFullYear())) / 12);
                var numOfEmpMonths = endDate.getMonth() - startEmpDate.getMonth() + (12 * (endDate.getFullYear() - startEmpDate.getFullYear())) % 12;
                var numOfEmpYears = Math.floor(endDate.getMonth() - startEmpDate.getMonth() + (12 * (endDate.getFullYear() - startEmpDate.getFullYear())) / 12);
                self.externalAppId = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + endDate.getTime();

                // console.log("numOfResMonths: " + numOfResMonths + " numOfResYears: " + numOfResYears + " numOfEmpMonths: " + numOfEmpMonths + " numOfEmpYears: " + numOfEmpYears);
                /*
                 var numOfResMonths = 5;
                 var numOfResYears = 5;
                 var numOfEmpMonths = 5;
                 var numOfEmpYears = 5;
                 */

                var msg = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cfp='http://xmlns.crif.com/schema/CFProxy'>"
                    + "<soapenv:Header/><soapenv:Body><cfp:startApplication><username>ApplicationStarter</username><password>password</password><processCacheId>MOVECU_COP</processCacheId>"
                    + "<processVersion></processVersion><documentInput><![CDATA[<DocumentInput><Header DateTimeCreated='2016-09-12T18:39:08+05:30'"
                    + " OpenSkyApplicationID='" + self.externalAppId + "'/><Application><Product LoanAmountRequest='" + self.loanAmount +  "' LoanType='AUTO' Term='60'>"
                    + "<Vehicle CbCondition='N' CurrentMileage='0' Downpayment='0' ModelYear='2016' Price='30000.00' Type='AUTO' /></Product></Application>"
                    + "<Applicant ActiveDutyMilitary='N' ApplicantID='1' Bankruptcy='"  + self.bankruptcy + "' Birthdate='" + self.birthdate+ "' CoSignerAvailable='N'"
                    + " FirstName='" + self.firstName + "' LastName='" + self.lastName + "' MiddleName='' MonthlyDebt='" + self.mortgageRent + "' MonthlyExpenses='"+ self.monthlyExpenses +"'"
                    + " MonthlyIncome='" + self.monthlyIncome + "' Role='B' SSN='"+self.ssn+"' Salutation='' Type='I'><Employment EmploymentStatus='1' JobTitle='Nothing' Name='" + self.employer + "'"
                    + " TimeAtWorkMonths='" + numOfEmpMonths + "' TimeAtWorkYears='" + numOfEmpYears + "'/><Address City='" + self.city + "' HousingStatus='" +self.houseType+ "' Line1='"+ self.address +"' Line2='"+ self.address2 +"'"
                    + " MonthlyMortgage_Rent='"+ self.mortgageRent +"' PostalCode='" + self.zip + "' ResidenceMonths='" + numOfResMonths + "' ResidenceYears='" + numOfResYears + "' State='" + self.state +"'/><Contact AreaCode='"+ self.phone.substring(0,3)+"'"
                    + " Email='" + self.email + "' PhoneNumber='" + self.phone.substring(3,10) + "'/></Applicant></DocumentInput>]]></documentInput>"
                    + "</cfp:startApplication></soapenv:Body></soapenv:Envelope>";

                /*
                 var msgTest = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cfp='http://xmlns.crif.com/schema/CFProxy'>"
                 + "<soapenv:Header/><soapenv:Body><cfp:startApplication><username>ApplicationStarter</username><password>password</password><processCacheId>MOVECU_COP</processCacheId>"
                 + "<processVersion></processVersion><documentInput><![CDATA[<DocumentInput><Header DateTimeCreated='2016-09-12T18:39:08+05:30'"
                 + " OpenSkyApplicationID='" + "cheng123456" + "'/><Application><Product LoanAmountRequest='" + "1200" +  "' LoanType='AUTO' Term='60'>"
                 + "<Vehicle CbCondition='N' CurrentMileage='0' Downpayment='0' ModelYear='2016' Price='30000.00' Type='AUTO' /></Product></Application>"
                 + "<Applicant ActiveDutyMilitary='N' ApplicantID='1' Bankruptcy='"  + "N" + "' Birthdate='" + "1989-12-17" + "' CoSignerAvailable='N'"
                 + " FirstName='" + "JOHN" + "' LastName='" + "CONSUMER" + "' MiddleName='' MonthlyDebt='" + "1200" + "' MonthlyExpenses='"+ "2000" +"'"
                 + " MonthlyIncome='" + "7500" + "' Role='B' SSN='"+ "726554928" +"' Salutation='' Type='I'><Employment EmploymentStatus='1' JobTitle='Nothing' Name='" + "CRIF" + "'"
                 + " TimeAtWorkMonths='5' TimeAtWorkYears='5' /><Address City='"+ "Newark" +"' HousingStatus='" + "1" + "' Line1='"+ "630 BASKINS RD" +"' Line2='"+ "" +"'"
                 + " MonthlyMortgage_Rent='"+ "1200" +"' PostalCode='" + "32857" + "' ResidenceMonths='10' ResidenceYears='10' State='"+ "GA" +"'/><Contact AreaCode='"+ "321" +"'"
                 + " Email='" + "abc@abc.com" + "' PhoneNumber='" + "2265533" + "'/></Applicant></DocumentInput>]]></documentInput>"
                 + "</cfp:startApplication></soapenv:Body></soapenv:Envelope>";
                 */
                // console.log(msg);
                $http.post('http://10.110.28.172:8080/CFProxy-1.0.0/jaxws/CFProxyWS', msg, {
                    headers: {
                        'Content-Type':'text/xml',
                        'Accept':'text/xml',
                        'Access-Control-Allow-Credentials':'true',
                        'Access-Control-Allow-Methods':'POST',
                        'Access-Control-Allow-Origin':'*',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
                        'SOAPAction': ''
                    }
                }).then(function(response){
                    console.log(response);
                }, function(error){
                    console.err(error);
                })

            },
            'updateApp': function () {

            },
            'getAppInfo': function () {

            }
        };
        return self;
    });