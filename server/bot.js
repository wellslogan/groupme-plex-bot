var request = require('request');
var config = require("../config.js");

function processMessage(msg, name) {
    var keyword = config.bot.keyword;
    if (msg.length > keyword.length && msg.substring(0, keyword.length) == keyword) {
        callPlexApi(msg.substring(keyword.length + 1, msg.length), function(result) {
            postToGroup(result);
        });
    }
}

function postToGroup(msg) {
    console.log("posting " + msg);
    var options = {
        url: "https://api.groupme.com/v3/bots/post",
        method: "POST",
        json: true,
        body: {
            "bot_id": config.bot.id,
            "text": msg
        }
    };

    console.log(msg);

    request(options, function(error, response) {
        if (error || response.statusCode != 200) {
            console.log(error);
        }
    });
};

function callPlexApi(query, callback) {
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
            callback(processPlexResults(body));
        } else {
            callback("error: " + error);
        }
    });
};

function processPlexResults(data) {
    var count = data["_children"].length;
    if (count > 0 && data["_children"][0]["title"] != "Local Network") {
        var firstTitle = data["_children"][0]["title"];
        var firstYear = data["_children"][0]["year"];
        return count + ' result(s) found. Top result was "'+ firstTitle + '" (' + firstYear + ').\n';
    } else {
        return "No results found.\n"
    }
}

module.exports.processMessage = processMessage;
module.exports.callPlexApi = callPlexApi;
