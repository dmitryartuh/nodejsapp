/**
 * Created by dya on 11/6/2015.
 */

var engine = require('ejs-locals');
var express = require('express');
var app = express();
var server = app.listen(3001);
var io = require('socket.io').listen(server);

app.engine('ejs', engine);
app.set('view engine', 'ejs');

app.get('/', function(req, res){

});

// respond with "hello world" when a GET request is made to the homepage
app.get('/login', function(req, res) {
    res.render('login.ejs', {
        button: 'submit',
        login: 'login',
        pass: 'password',
        remember_me: 'remember me',
        title: 'Crosses & Zeroses!'})
});

app.post('/login', function(req, res){


});

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket) {
    console.log('Client connected...');
    socket.on('send_login_data', function (data) {
        console.log(data);
    });
});
