/**
 * Created by User on 15.11.2015.
 */
var app = angular.module('gameApp', []);

app.controller('gameController', ['$scope', function($scope){
    $scope.started = false;
    this.socket = io.connect('http://localhost:3002');
    this.socket.on('connect_failed', function(){
        console.log('Connection Failed');
    });

    this.socket.on('connecting', function () {
        console.log('connecting...');
    });

    this.socket.on('connect', function () {
        console.log('connected!');
    });

    this.startNewGame = function() {
        this.socket.emit('user_connect', { id : this.user_id });
    };

    this.setZero = function(i, j){
        $('#' + i + j + '.image').removeClass('empty').addClass('cross');
    }
}]);