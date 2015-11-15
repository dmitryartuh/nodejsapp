/**
 * Created by dya on 11/6/2015.
 */
var engine = require('ejs-locals');
var express = require('express');
var app = express();
var server = app.listen(3002);
var io = require('socket.io').listen(server);

var global_id = 1;

var db = require('db');

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
    if(req.query.token != undefined && req.query.token != null && req.query.token != '') {
        var arg = req.query.token.split('_');
        if(db.check_login(arg[0], arg[1])) {
            res.render('game.ejs', {
                title: 'game',
                start_game: 'start game',
                id: req.query.token
            })
        }
    }
});

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
    console.log('Client connected...');
    socket.on('send_login_data', function (data) {
        if(data.data.login != undefined && data.data.login != null &&
            data.data.pass != undefined && data.data.pass != null) {
            console.log('-----------1----------')
            console.log(db.check_login(data.login, data.pass))
            var success = db.check_login(data.login, data.pass)
            if(success) {
                socket.emit('login_back', {
                    login_state: success,
                    token: data.data.login + '_' + data.data.pass + '_' + global_id++
                });
            }
            else{
                socket.emit('login_back', {
                    login_state: success
                });
            }
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
console.log(test)
