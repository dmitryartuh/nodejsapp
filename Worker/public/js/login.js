/**
 * Created by User on 13.11.2015.
 */
var loginApp = angular.module('loginApp', []);

loginApp.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        }
    }
});

loginApp.controller('login_form', ['$scope', '$http', '$location', 'Base64', function($scope, $http, $location, Base64) {

    this.sendInfo = function(){
        var data = {
            pass: this.pass,
            login: this.login
        };
        $http({
            method: 'POST',
            url: $location.absUrl(),
            data: data
        }).then(function successCallback(response) {
            if (response.data.login_state){
                $scope.inlog = true;
            }
            else{
                $scope.inlog = false;
            }
        }, function errorCallback(response) {
            console.log('error');
        });
    };

    this.startNewGame = function(){
        $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(this.login + ':' + this.pass);
        $http({
            method: 'GET',
            url: '/startGame'
        });
    }
}]);