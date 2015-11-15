/**
 * Created by User on 13.11.2015.
 */
var loginApp = angular.module('loginApp', []);

loginApp.controller('login_form', ['$scope', function($scope) {
    this.socket = io.connect('http://localhost:3002');
    $scope.inlog = false;
    $scope.token = '';
    this.socket.on('connect_failed', function(){
        console.log('Connection Failed');
    });

    this.socket.on('connecting', function () {
        console.log('connecting...');
    });

    this.socket.on('connect', function () {
        console.log('connected!');
    });
    this.sendInfo = function(){
        var data = {
            pass: this.pass,
            login: this.login
        };
        this.socket.emit('send_login_data', { data: data });
    };
    this.socket.on('login_back', function(data){
        if (data.login_state){
            $scope.inlog = true;
            $scope.token = data.token;
        }
        else{
            $scope.inlog = false;
            $scope.token = '';
        }
        $scope.$apply()
    });
}]);