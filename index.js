/**
 * Created by dya on 11/6/2015.
 */
var config = require('./config')
var engine = require('ejs-locals');
var express = require('express');
var app = express();
var server = app.listen(config.start_port);
var io = require('socket.io').listen(server);
var iodb = require('socket.io-client');

app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.redirect('/login');
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/login', function(req, res) {
    res.render('login.ejs', {
        button: 'submit',
        login: 'login',
        pass: 'password',
        remember_me: 'remember me',
        title: 'Crosses & Zeroses!',
        go: 'start game'})
});

app.get('/game', function(req, res){
    res.render('game.ejs', {
        title: 'game',
        start_game: 'start game',
        id: req.query.token
    })
});

app.use(express.static(__dirname + '/public'));


io.sockets.on('connection', function (socket) {
    console.log('Client connected...');
    socket.on('send_login_data', function (data) {
        if(data.data.login != undefined && data.data.login != null &&
            data.data.pass != undefined && data.data.pass != null) {
            console.log('-----------check login data----------' + data.data.login + '   ' + data.data.pass)
            var socketdb = iodb.connect(config.db_address);
            socketdb.on('send_checked_data', function(res){
                console.log('data from db: ' + res.result);
                if(res.result !== null){
                    socket.emit('login_back', {
                        login_state: true,
                        token: res
                    });
                }
                else{
                    socket.emit('login_back', {
                        login_state: false
                    });
                }
            });
            socketdb.emit('send_data_for_check', {
                login: data.data.login,
                pass: data.data.pass
            });


        }
        else{
            socket.emit('login_back', {
                login_state: false
            });
        }
    });

    socket.on('user_connect', function(data){
        console.log(data);
    });

    socket.on('user_data', function(data){

    });

});

var test = require('game_session')(1,2,3,4);
//console.log(test)
