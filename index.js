/**
 * Created by dya on 11/6/2015.
 */
var express = require('express');
var io = require('socket.io');
var engine = require('ejs-locals');


var app = express()


// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    res.sendfile('views/layout.html', {})
});

app.use(express.static(__dirname + '/public'));

app.listen(3000);
