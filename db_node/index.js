/**
 * Created by User on 15.11.2015.
// */
var config = require('./config')
var express = require('express');
var app = express();
var server = app.listen(config.start_port);
var io = require('socket.io').listen(server);

var nano = require('nano')(config.couchdb_address);
var db_name = "test";
var db = nano.use(db_name);

io.sockets.on('connection', function (socket) {
    console.log('Client connected...');
    socket.on('send_data_for_check', function (data) {
	console.log('received data: ' + data.login + ', ' + data.pass);
        if(data.login != undefined && data.login != null &&
            data.pass != undefined && data.pass != null){
				nano.db.use('test').list(function(err, body) {
					if (!err) {
						body.rows.forEach(function(doc) {
							db.get(doc.id, function(err, doc) {
                                if(doc.login != undefined && doc.pass != undefined){
                                    if(doc.login == data.login && doc.pass == data.pass){
                                        socket.emit('send_checked_data', {
                                            result: doc._id
                                        });
										console.log('found id = ' + doc._id);
										return;
                                    }
                                }
							});
						});
					}
                    else{
                        socket.emit('send_checked_data', {
                            result: null
                        });
                    }
				});
		}
        else{
            socket.emit('send_checked_data', {
                result: null
            });
        }
    });
});
console.log('started');






