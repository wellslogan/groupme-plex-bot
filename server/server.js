var express = require('express');
var bodyParser = require('body-parser');
var bot = require('./bot.js');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    if (req.query.query) {
        bot.callPlexApi(req.query.query, function(result) {
            res.send(result);
        });
    } else {
        res.send("No results found in Plex library");
    }

});

app.post('/', function(req, res) {
    bot.processMessage(req.body.text, req.body.name);
});

app.listen(config.port);
