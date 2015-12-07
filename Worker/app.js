var config = require('./config')
var express = require('express');
var app = express();
var server = app.listen(config.start_port);
var io = require('socket.io').listen(server);
var manager = require('manager');
var uf = require('user');
var gf = require('game_session');
var async = require('async');

var rooms = -1;

function get_room_number(){
    rooms += 1;
    return rooms;
}

app.get('/isWorking', function(req, res){
  res.sendStatus(200);
  console.log('checked');
});

io.sockets.on('connection', function (socket) {
    console.log('Client connected... ' + socket.id);
    var user = manager.find_user(socket.id);
    if(user == null){
        manager.add_user(uf.create_user(socket.id, socket));
    }
    else{
        socket.emit('double_connect');
        return;
    }
    console.log('all users ' + manager.all().length);
    console.log('free users ' + manager.free().length);

  socket.on('new_game', function(){
    async.waterfall([
        function(callback){
            callback(null, manager.find_user(socket.id));
        },
        function(user, callback){
          if(user != null){
              callback(null, user, manager.find_wait_game());
          }
        },
        function(user, game){
          if(game != null){
              game.add_user(user.id);
              user.game_session = game.id;
              socket.join('room' + game.id);
              manager.remove_wait_user(user.id);
              io.to('room' + game.id).emit('started_new_game', game);
              console.log('started game ' + game.id + ' with ' + game.users_id[0] + ' and ' + user.id);
          }
          else{
              var number = get_room_number();
              manager.start_new_game(gf.create_new_game_session(number, user.id));
              user.game_session = number;
              socket.join('room' + number);
              console.log('created game ' + number + ' with ' + user.id);
              socket.emit('wait_partner', manager.find_game(number));
          }
        }], function(err){
            console.log('error with new_game');
            socket.emit('error');
        }
    );
  });

  socket.on('disconnect', function(){
        console.log('Client disconnected... ' + socket.id);
      manager.remove_user(socket.id);
      console.log('all users ' + manager.all().length);
      console.log('free users ' + manager.free().length);
  });

  socket.on('update_state', function(data){
      var game = manager.find_game(data.id);
      var set_step_res = game.set_step(data);
      if(set_step_res){
          var step_res = game.next_step();
          if(!step_res && game.finished) {
              if(game.winner_count > 1){
                  io.to('room' + game.id).emit('draw');
              }
              else {
                  var winner_id = game.get_winner();
                  var losser_id = game.get_losser();
                  console.log('winner - ' + winner_id);
                  console.log('losser - ' + losser_id);
                  var winner = manager.find_user(winner_id);
                  var losser = manager.find_user(losser_id);
                  winner.socket.emit('won');
                  losser.socket.emit('lost');
              }

              manager.finished_game(game.id);
          }
          else{
              io.to('room' + game.id).emit('update', game);
          }
      }
      else{
          console.log('set next step error');
          socket.emit('error');
      }

  });
  //
  //socket.on('game_finished', function(){
  //
  //});
});
console.log('worker started');