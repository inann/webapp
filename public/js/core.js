// public/js/core.js
var helloGov = angular.module('helloGov', ['ngMapAutocomplete']).config(function($interpolateProvider){
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});

helloGov.controller('visitorController', function ($scope, $http, $window) {

    $scope.locResult = '';
    $scope.locOptions = null;
    $scope.locDetails = '';

    $scope.update = function() {
        coordinates = {"latitude": $scope.locDetails.geometry.location.lat(),
                        "longitude": $scope.locDetails.geometry.location.lng()};

        $http.get('/locateLegislator', {params: coordinates})
        .then(function(result) {
            $scope.repFound = result.data.representativeFound;
            $scope.repInfo = result.data.representativeInfo;

            $scope.addrForm = false;
            if($scope.repFound) {
                $scope.repForm = true;
            } else {
                $scope.repNotFoundForm = true;
            }

        })
        .catch(function(data) {
            console.log(data);
        });
    }

    $scope.addrForm = true;
    $scope.repForm = false;
    $scope.repNotFoundForm = false;
});

helloGov.controller('campaignController', function ($scope, $http, $window, $location) {
    $scope.formData = {};
    $http.get('/campaignList', $scope.campaigns)
    .then(function(result) {
        $scope.campaigns = result.data;
    })
    .catch(function(data) {
        console.log('Error: ' + data);
    });

    $scope.createCampaign = function(publishFlag) {
        $scope.formData.publish = publishFlag;

        // if on an edit page, then grab the shortid from URL
        var urlSplit = $location.absUrl().split('/');
        if(urlSplit.indexOf("edit") != -1) {
            $scope.formData.shortid = urlSplit[4];
        }

        $http.post('/campaign/create', $scope.formData)
            .then(function(result) {
                console.log(result.data);
                $window.location.href = '/campaignSuccess?shortid='+result.data;
            })
            .catch(function(data) {
                console.log('Error: ' + data);
            }
        );
    };

});

helloGov.controller('successController', function($scope, $location) {
    $scope.formData = {};
    var urlSplit = $location.absUrl().split('=');
    console.log(urlSplit);
    $scope.formData.shortid = urlSplit[1];
    console.log($scope.formData.shortid);
});


helloGov.controller('userController', function ($scope, $http, $window) {
    $scope.loginDetails = {};
    $scope.signupDetails = {};

    $scope.signUp = function() {
        $http.post('/signup', $scope.signupDetails)
            .then(function(data) {
                $scope.signUpDetails = {};
                $scope.session = data;
                $window.location.href = '/';
                console.log(data);
            })
            .catch(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.login = function() {
        $http.post('/login', $scope.loginDetails)
            .then(function(data) {
                $scope.loginDetails = {};
                $scope.session = data;
                $window.location.href = '/';
                console.log(data);
            })
            .catch(function(data) {
                $('#login-message').html("Login failed");
            });
    };
});
