/**
 * Created by Logan on 3/5/16.
 */
var _ = require('underscore');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var config = require("./config");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/plex', function(req, res) {


    //res.send(_.filter([1, 2, 3], function(item) {return item % 2 == 0;}));
});

app.post('/plex', function(req, res) {
    var body = req.body;

    processMessage(req.body.text, req.body.name);

});

processMessage = function(msg, name) {
    var keyword = config.bot.keyword;
    if (msg.length > keyword.length && msg.substring(0, keyword.length + 1) == keyword) {
        var result = callPlexApi(msg.substring(keyword.length));

        postToGroup(result);
    }
}

postToGroup = function(msg) {
    var options = {
        url: "https://api.groupme.com/v3/bots/post",
        method: "POST",
        json: true,
        body: {
            "bot_id": config.bot.id,
            "text": msg
        }
    };

    request(options, function(error, response) {
        if (error || response.statusCode != 200) {
            console.log(error);
        }
    });
};

callPlexApi = function(query) {
    var options = {
        url: config.plex.baseurl + "/search?query=" + query,
        headers: {
            "Accept": "application/json",
            "X-Plex-Token": config.plex.token
        },
        json: true
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            return processPlexResults(body);
        }
    });
};

processPlexResults = function(data) {
    var count = data["_children"].length;
    if (count > 0) {
        var firstTitle = data["_children"][0]["title"];
        var firstYear = data["_children"][0]["year"];
        return count + ' results found. Top result was "'+ firstTitle + '" (' + firstYear + ')';
    } else {
        return "No results found."
    }
}

app.listen(3000);
