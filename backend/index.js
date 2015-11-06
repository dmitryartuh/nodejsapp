/**
 * Created by dya on 11/6/2015.
 */
var express = require('express');
var io = require('socket.io');

var app = express()
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
    res.status = 200;
    res.send('hello world')
});

app.listen(3000);