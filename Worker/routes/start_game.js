/**
 * Created by User on 22.11.2015.
 */
var auth = require('basic-auth');
var express = require('express');
var util = require('util');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var user = auth(req);
    console.log(util.inspect(user));
    res.render('game.ejs', {
        title: 'game',
        start_game: 'start game',
        id: req.query.token
    });
});

module.exports = router;