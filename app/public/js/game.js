/**
 * Created by User on 15.11.2015.
 */

gameApp.controller('gameController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){
    $scope.game_started = false;
    this.start_game = function() {
        if(this.socket != undefined && this.socket.connected) {
            this.socket.disconnect();
        }
        this.socket = io.connect($rootScope.worker_url);




        this.socket.on('connect_failed', function () {

        });

        this.socket.on('connecting', function () {
            console.log('connecting...');
        });

        this.socket.on('connect', function () {
            $scope.game_started = true;
            $scope.$apply();
            $timeout(function() {
                var cw = $('.image').width();
                $('.image').css({'height':cw+'px'});
            }, 100);
        });

        this.setZero = function (i, j) {
            $('#' + i + j + '.image').removeClass('empty').addClass('cross');
        }
    }
}]);