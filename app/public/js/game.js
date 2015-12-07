/**
 * Created by User on 15.11.2015.
 */

gameApp.controller('gameController', ['$scope', '$rootScope', '$timeout', function($scope, $rootScope, $timeout){
    $scope.game_started = false;
    this.start_game = function() {
		var gc = this;
        if(this.socket === undefined) {
            this.socket = io.connect($rootScope.worker_url);
        }
        
        this.socket.on('connect_failed', function () {

        });

        this.socket.on('connecting', function () {
            console.log('connecting...');
        });
		
		this.socket.on('wait_partner', function(data) {
			console.log(data);
		});
		
		this.socket.on('double_connect', function(data){
			console.log('double_connect');
		});
		
		this.socket.on('won', function(data){
			$scope.game_started = false;
			$scope.$apply();
			console.log('won');
		});
		
		this.socket.on('lost', function(data){
			$scope.game_started = false;
			$scope.$apply();
			console.log('lost');
		});

        this.socket.on('started_new_game', function (game) {
            $scope.game_started = true;
			gc.game = game;
			gc.step = false;
			if(gc.game.current_user == gc.socket.id){
				gc.step = true;
			}
            $scope.$apply();
            $timeout(function() {
                var cw = $('.image').width();
                $('.image').css({'height':cw+'px'});
            }, 100);
        });
		
		this.socket.on('update', function(game) {
			if(game.current_user == gc.socket.id){
				gc.step = true;
			}
			gc.updateState(game.state);
		});
		
		this.socket.emit('new_game');
    };
	
	
	this.setZero = function (i, j) {
		if(this.step && $scope.game_started) {
			if(this.game.state[i - 1][j - 1] != -1){
				return;
			}
			this.step = false;
			this.socket.emit('update_state', {
				id: this.game.id,
				x: i - 1,
				y: j - 1
			});
		}
		// $('#' + i + j + '.image').removeClass().addClass(this.step);
	};
	
	this.updateState = function(sessionState){
		if(sessionState != null){
			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < 3; j++){
					var ii = i + 1;
					var jj = j + 1;
					$('#' + ii + jj + '.image').removeClass('zero cross empty');
					if(sessionState[i][j] == 0){
						$('#' + ii + jj + '.image').addClass('zero');
					}
					else if (sessionState[i][j] == 1){
						$('#' + ii + jj + '.image').addClass('cross');
					}
					else {
						$('#' + ii + jj + '.image').addClass('empty');
					}					
				}
			}
		}
	};
}]);