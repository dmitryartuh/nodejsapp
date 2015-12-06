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
  manager.add_user(uf.create_user(socket.id, socket.handshake.query.login));

  socket.on('new_game', function(){
    async.waterfall([
        function(callback){
            callback(manager.find_user(socket.id));
        },
        function(user, callback){
          if(user != null){
              callback(user, gs.find_wait_game());
          }
        },
        function(user, game){
          if(game != null){
              game.add_user(user.id);
              user.game_session = game.id;
              socket.join('room' + game.id);
              io.to('room' + game.id).emit('game_started', game);
              console.log('started game ' + game.id + ' with ' + game.users_id[0] + ' and ' + user.id);
          }
          else{
              var number = get_room_number();
              manager.start_new_game(gf.create_new_game_session(number, user.id));
              user.game_session = number;
              console.log('created game ' + number + ' with ' + user.id);
          }
        }], function(err){
            console.log('error with new_game');
            socket.emit('error');
        }
    );
  });

  socket.on('disconnect', function(){
        console.log('Client disconnected... ' + socket.id);
  });

  //socket.on('update_state', function(){
  //
  //});
  //
  //socket.on('game_finished', function(){
  //
  //});
});
console.log('worker started');