var request = require('request');
var config = require("../config.js");

function processMessage(msg, name) {
    var keyword = config.bot.keyword;
    if (msg === "@zachaltneu6 cool" || msg === "@zaltneu6 cool") {
        postToGroup("", [{
            "type": "image",
            "url": "https://i.imgur.com/5eMBhRC.jpg"
        }]);
    }
    else if (msg.length > keyword.length && msg.substring(0, keyword.length) === keyword) {
        callPlexApi(msg.substring(keyword.length + 1, msg.length), function(result) {
            postToGroup(result);
        });
    }
}

function postToGroup(msg, attachments) {
    console.log("posting " + msg);
    var options = {
        url: "https://api.groupme.com/v3/bots/post",
        method: "POST",
        json: true,
        body: {
            "bot_id": config.bot.id,
            "text": msg,
            "attachments": attachments
        }
    };

    console.log(msg);

    request(options, function(error, response) {
        if (error || response.statusCode != 200) {
            console.log(error);
        }

        res.end();
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
            callback("Error: Bad search terms or Plex is down.");
        }
        res.end();
    });
};

function processPlexResults(data) {
    var count = data["_children"].length;
    if (count == 4) {
        return "No results found.\n";
    } else {
        var arr = data["_children"].splice(0, count - 4);
        var firstTitle = arr[0]["title"];
        var firstYear = arr[0]["year"];
        return count - 4 + ' result(s) found. Top result was "'+ firstTitle + '" (' + firstYear + ').\n';
    }
}

module.exports.processMessage = processMessage;
module.exports.callPlexApi = callPlexApi;
