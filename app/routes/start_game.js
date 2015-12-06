/**
 * Created by User on 22.11.2015.
 */
var auth = require('basic-auth');
var express = require('express');
var util = require('util');
var router = express.Router();
var wm = require('worker_manager');
var db = require('db');

/* GET home page. */
router.get('/', function(req, res, next) {
    var user = auth(req);
    user.login = user.name;
    console.log('get worker url by ' + util.inspect(user));
        db.check_user(user, function(data){
            console.log('check auth - ' + data)
            if(data){
                var worker_url = wm.get_worker();
                console.log('return worker url - ' + worker_url);
                res.end(worker_url);
            }
            else{
                res.end();
            }
        });
});

module.exports = router;