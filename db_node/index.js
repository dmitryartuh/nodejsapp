/**
 * Created by User on 15.11.2015.
// */
var config = require('./config')
var express = require('express');
var util = require('util');
var async = require('async');
var app = express();
var server = app.listen(config.start_port);
var io = require('socket.io').listen(server);

var nano = require('nano')(config.couchdb_address);
var db_name = config.db_name.users;
var db = nano.use(db_name);

io.sockets.on('connection', function (socket) {
    console.log('Client connected...');
    socket.on('send_data_for_check', function (data) {
	console.log('received data: ' + data.login + ', ' + data.pass);
        if(data.login != undefined && data.login != null &&
            data.pass != undefined && data.pass != null){
				nano.db.use(db_name).list(function(err, body) {
					if (!err) {
                        var count = 0;
                        var finished = false;
						body.rows.forEach(function(doc) {
                            count ++;
							db.get(doc.id, function(err, doc) {
                                if(doc.login != undefined && doc.pass != undefined){
                                    if(doc.login == data.login && doc.pass == data.pass){
                                        socket.emit('send_checked_data', {
                                            result: doc._id
                                        });
										console.log('found id = ' + doc._id);
                                        finished = true;
                                    }
                                }
                                if(count == body.rows.length && !finished){
                                    console.log('not found');
                                    socket.emit('send_checked_data', {
                                        result: null
                                    });
                                }
							});
						});
					}
                    else{
						console.log('get user list error')
                        socket.emit('send_checked_data', {
                            result: null
                        });
                    }
				});
		}
        else{
            console.log('input data is not valid')
            socket.emit('send_checked_data', {
                result: null
            });
        }
    });
});
console.log('started');

nano.db.use(db_name).list(function(err, body) {
    if (!err) {
        body.rows.forEach(function(doc) {
            db.get(doc.id, function(err, doc) {
                console.log(util.inspect(doc));
            });
        });
    }
    else{
        console.log('start get users error');
    }
});




