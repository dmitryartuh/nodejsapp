/**
 * Created by User on 15.11.2015.
 */

gameApp.controller('gameController', ['$window', '$scope', '$rootScope', '$timeout', function($window, $scope, $rootScope, $timeout){
    $scope.game_started = false;
    $scope.wait = false;
	this.message = '';
	this.connected = false;
	this.connect = function(){
		var gc = this;
        this.socket = io.connect($rootScope.worker_url);
        this.connected = true;

        this.socket.on('connecting', function () {
            console.log('connecting...');
        });
		
		this.socket.on('disconnect', function(){
			console.log('disconnected');
			$scope.game_started = false;
			gc.connected = false;
			$scope.$apply();
			alert('something went wrong');
			$window.location.reload();
		});
		
		this.socket.on('wait_partner', function(data) {
			console.log(data);
		});
		
		this.socket.on('error', function(data) {
			alert('something went wrong');
			$window.location.reload();
		});
		
		this.socket.on('double_connect', function(data){
			console.log('double_connect');
		});
		
		this.socket.on('won', function(data){
			console.log('won');
			gc.game_finished(true);
		});
		
		this.socket.on('draw', function(data){
			console.log('draw');
			gc.game_finished(false);
		});
		
		this.socket.on('lost', function(data){
			console.log('lost');
			gc.game_finished(false);
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
			gc.game = game;
			
			gc.updateState(game.state);
		});
	};
    this.start_game = function() {
		if($scope.wait){
			return;
		}
		$scope.wait = true;
		$.each($('.image'), function(key, value){
			$(value).removeClass('zero cross empty').addClass('empty');
		});
        if(!this.connected){
			this.connect();
		}
		this.message = '';
		this.socket.emit('new_game');
    };
	
	this.game_finished = function(value){
		if(value){
			this.message = 'Won! Nice work!';
		}
		else {
			this.message = 'Loser!';
		}
		$scope.game_started = false;
		$scope.wait = false;
		$scope.$apply();
	}
	
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