/**
 * Created by User on 22.11.2015.
 */
var express = require('express');
var util = require('util');
var router = express.Router();
var db = require('db');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login.ejs', {
        button: 'submit',
        login: 'login',
        pass: 'password',
        remember_me: 'remember me',
        title: 'Crosses & Zeroses!',
        go: 'start game'});
});

router.post('/', function(req, res, next){
    console.log('received data '+ util.inspect(req.body));

    db.check_user(req.body, function(data){
        console.log('callback - ' + data);
        res.write(JSON.stringify({
            login_state: data
        }));
        res.end();
    });

});

module.exports = router;