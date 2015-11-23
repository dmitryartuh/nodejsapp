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
        db.check_user(user, function(data){
            if(data){
                res.end(wm.get_worker());
            }
            else{
                res.end();
            }
        });
});

module.exports = router;