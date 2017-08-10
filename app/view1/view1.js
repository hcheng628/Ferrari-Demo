'use strict';

angular.module('myApp.view1', [
    'ngRoute',
    'mgcrea.ngStrap',
    'ngAnimate',
    'toaster',
    'angularSpinner',
    'angular-ladda'
])

    .config(['$routeProvider', 'laddaProvider', function($routeProvider, laddaProvider) {
        /*
         laddaProvider
         spinnerSize: 35,
         spinnerColor: '#ffffff'
         */

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

        $scope.steps = [
            'Step 1: Personal Information',
            'Step 2: Residence Information',
            'Step 3: Employment Information',
            'Step 4: Loan Information',
            'Step 5: Agreement & Verification'
        ];


        $scope.showCreateModal = function () {
            $scope.createModal = $modal({
                scope: $scope,
                template: 'view1/templates/modal.offers.tpl.html',
                show: true
            })
        };

        $scope.showBureauModal = function () {
            $scope.createModal = $modal({
                scope: $scope,
                template: 'view1/templates/modal.bureau.tpl.html',
                show: true
            })
        };

        $scope.startSpin = function () {
            usSpinnerService.spin('spinner-1');
        };

        $scope.stopSpin = function () {
            usSpinnerService.stop('spinner-1');
        };

        $scope.startApp = function () {
            $scope.cfService.startApp().then(function(resp){
                console.log("Success Start App");
                if ($scope.cfService.processEngineGuid) {
                    $scope.cfService.isApiCalling = true;
                    setTimeout(function () {
                        $scope.getAppInfo();
                        $scope.cfService.isApiCalling = false;
                    }, 35000);
                };
            }, function (error) {
                console.error(error);
            });
        };

        $scope.getAppInfo =function () {
            $scope.cfService.getAppInfo().then(function(resp){
                console.log("Success Get App Info");
                $scope.showCreateModal();
            }, function(err){
                console.error(err);
            });
        };


        $scope.updateApp = function (institutionName, offerID, loanType) {
            // console.log(institutionName + " " + offerID + " " + loanType);
            /* */
            $scope.cfService.updateApp(institutionName, offerID, loanType).then(function(resp){
                console.log("Success Get App Info");
                console.log(resp);
                $scope.createModal.hide();
            }, function(err){
                console.error(err);
            });

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
            'ACTionID': '',
            'hasOffersFlag': null,
            'isApiCalling': false,
            'processEngineGuid': '',
            'firstName': "JONATHAN",
            'lastName': "CONSUMER",
            'email': 'praful.asher.uat@gmail.com',
            'ssn':999999991,
            'birthdate': '1989-12-17',
            'phone':'703650066',
            'address': '630 BASKINS RD',
            'address2':'',
            'city': 'BURLISON',
            'state':'CA',
            'zip':'91325',
            'houseType':'1',
            'residenceSince': '2006-12-17',
            'mortgageRent':1200,
            'bankruptcy':'N',
            'employmentStatus':'1',
            'employer':'ACCB',
            'employerSince':'2000-12-17',
            'monthlyIncome':7500,
            'otherIncome':1000,
            'monthlyExpenses':2000,
            'loanType':'AUTO',
            'loanAmount': 50000,
            'externalAppId': '',
            'offers': [],
            'institutions': [],
            'isSearching': false,
            'isSaving': false,
            'search': null,
            'startApp': function () {
                var d = $q.defer();
                var endDate = new Date();
                var startResdate = new Date(self.residenceSince);
                var startEmpDate = new Date(self.employerSince);

                var numOfResMonths = parseInt(endDate.getMonth() - startResdate.getMonth() + (12 * (endDate.getFullYear() - startResdate.getFullYear()))) % 12;
                var numOfResYears = Math.floor(endDate.getMonth() - startResdate.getMonth() + (12 * (endDate.getFullYear() - startResdate.getFullYear())) / 12);
                var numOfEmpMonths = parseInt(endDate.getMonth() - startEmpDate.getMonth() + (12 * (endDate.getFullYear() - startEmpDate.getFullYear()))) % 12;
                var numOfEmpYears = Math.floor(endDate.getMonth() - startEmpDate.getMonth() + (12 * (endDate.getFullYear() - startEmpDate.getFullYear())) / 12);
                self.externalAppId = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1) + endDate.getTime();
                // console.log("numOfResMonths: " + numOfResMonths + " numOfResYears: " + numOfResYears + " numOfEmpMonths: " + numOfEmpMonths + " numOfEmpYears: " + numOfEmpYears);
                /*
                 var numOfResMonths = 5;
                 var numOfResYears = 5;
                 var numOfEmpMonths = 5;
                 var numOfEmpYears = 5;
                 */

                var currentUrl = window.location.href;
                console.log( currentUrl.substring(0, currentUrl.indexOf('8080') + 5) + "CFProxy-1.0.0/jaxws/CFProxyWS");
                var proxyUrl = currentUrl.substring(0, currentUrl.indexOf('8080') + 5) + "CFProxy-1.0.0/jaxws/CFProxyWS";

                var msg = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cfp='http://xmlns.crif.com/schema/CFProxy'>"
                    + "<soapenv:Header/><soapenv:Body><cfp:startApplication><username>ApplicationStarter</username><password>atlanta2016</password><processCacheId>CIAO_BELLA</processCacheId>"
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

                // console.log(msg);
                self.isApiCalling = true;
                $http.post(proxyUrl, msg, {
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
                    // console.log(response.data);
                    var x2js = new X2JS();
                    var aftCnv = x2js.xml_str2json(response.data);

                    if(aftCnv.Envelope.Body.startApplicationResponse.return._Status == "SUCCESS") {
                        self.processEngineGuid = aftCnv.Envelope.Body.startApplicationResponse.return.Header.ProcessEngineGuid;
                        self.isApiCalling = false;
                        toaster.pop('success', 'CreditFlow AppID: ' + aftCnv.Envelope.Body.startApplicationResponse.return.Header.ApplicationID);
                        setTimeout(function () {
                            toaster.pop({
                                type: 'info',
                                body: 'Waiting for Offers'
                            });
                        }, 3000);
                        d.resolve();
                    }
                }, function(error){
                    console.err(error);
                    self.isApiCalling = false;
                    toaster.pop('error', 'Failed Starting Application in CreditFlow');
                    d.reject(error);
                });
                return d.promise;

            },
            'updateApp': function (institutionName, offerID, loanType) {
                console.log("updateApp: " + institutionName + " " + offerID + " " + loanType);
                self.isApiCalling = true;

                var d = $q.defer();
                var currentUrl = window.location.href;
                console.log( currentUrl.substring(0, currentUrl.indexOf('8080') + 5) + "CFProxy-1.0.0/jaxws/CFProxyWS");
                var proxyUrl = currentUrl.substring(0, currentUrl.indexOf('8080') + 5) + "CFProxy-1.0.0/jaxws/CFProxyWS";

                var msg = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cfp='http://xmlns.crif.com/schema/CFProxy'><soapenv:Header/><soapenv:Body>"
                    +"<cfp:updateApplication><username>ApplicationStarter</username><password>atlanta2016</password><processEngineGuid>" + self.processEngineGuid + "</processEngineGuid><activityId></activityId>"
                    +"<documentInput><![CDATA[<DocumentUpdate><Header ApplicationID='2903' DateTime='2016-10-04T15:24:44.823' ProcessEngineGuid='"+ self.processEngineGuid + "' /><OfferSelection Action='SELECT' "
                    + " InstitutionName='" + institutionName + "' LoanType='" + loanType + "' OfferID='" + offerID + "'/></DocumentUpdate>]]></documentInput></cfp:updateApplication></soapenv:Body></soapenv:Envelope>";
                console.log(msg);

                $http.post(proxyUrl, msg, {
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
                    var x2js = new X2JS();
                    var aftCnv = x2js.xml_str2json(response.data);
                    console.log(aftCnv.Envelope.Body.updateApplicationResponse);

                    if (aftCnv.Envelope.Body.updateApplicationResponse.return.Header.ApplicationID) {
                        self.ACTionID = aftCnv.Envelope.Body.updateApplicationResponse.return.Header.ApplicationID;
                        toaster.pop('success', 'ACTion Application Created');
                    }

                    self.isApiCalling = false;
                    d.resolve();
                }, function(error){
                    // console.err(error);
                    self.isApiCalling = false;
                    d.reject(error);
                });
                return d.promise;
            },
            'getAppInfo': function () {
                var d = $q.defer();

                var currentUrl = window.location.href;
                console.log( currentUrl.substring(0, currentUrl.indexOf('8080') + 5) + "CFProxy-1.0.0/jaxws/CFProxyWS");
                var proxyUrl = currentUrl.substring(0, currentUrl.indexOf('8080') + 5) + "CFProxy-1.0.0/jaxws/CFProxyWS";

                var msg = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:cfp='http://xmlns.crif.com/schema/CFProxy'><soapenv:Header/>"
                    + "<soapenv:Body><cfp:getApplicationInfo><username>ApplicationStarter</username><password>atlanta2016</password><processEngineGuid>"
                    + self.processEngineGuid + "</processEngineGuid><applicationId>2903</applicationId></cfp:getApplicationInfo></soapenv:Body></soapenv:Envelope>";

                self.isApiCalling = true;

                $http.post(proxyUrl, msg, {
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
                    var x2js = new X2JS();
                    var aftCnv = x2js.xml_str2json(response.data);
                    // console.log(aftCnv.Envelope.Body.getApplicationInfoResponse.return.Offer);
                    // console.log(aftCnv.Envelope.Body.getApplicationInfoResponse.return);

                    if (aftCnv.Envelope.Body.getApplicationInfoResponse.return.Application._Status == "WT_OFFERS") {
                        //console.log('Here');
                        for (var i=0; i < aftCnv.Envelope.Body.getApplicationInfoResponse.return.Offer.length; i++) {
                            if(aftCnv.Envelope.Body.getApplicationInfoResponse.return.Offer[i]._OfferID){
                                self.offers.push(aftCnv.Envelope.Body.getApplicationInfoResponse.return.Offer[i]);
                                if (self.institutions.indexOf(aftCnv.Envelope.Body.getApplicationInfoResponse.return.Offer[i]._InstitutionName) < 0) {
                                    self.institutions.push(aftCnv.Envelope.Body.getApplicationInfoResponse.return.Offer[i]._InstitutionName);
                                    console.log("Pushed to institutions" + aftCnv.Envelope.Body.getApplicationInfoResponse.return.Offer[i]._InstitutionName);
                                    self.hasOffersFlag = true;
                                }
                            }
                            if (self.offers.length < 1) {
                                self.hasOffersFlag = false;
                            }
                        }
                    }
                    self.isApiCalling = false;
                    d.resolve();
                    // console.log(self.offers);
                }, function(error){
                    // console.err(error);
                    self.isApiCalling = false;
                    d.reject(error);
                });
                return d.promise;
            }
        };
        return self;
    });