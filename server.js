var http = require('http');
var fs = require('fs');
var json;
fs.readFile('favs.json', 'utf8',
    function (err, data) {
        if (err) {
            throw err;
        }
        json = JSON.parse(data);
    }
);

var getAllTweets = new RegExp('^/getAllTweets/.*$');
var getAllTwitterUsers = new RegExp('^/getAllTwitterUsers/.*$');
var getAllExternalLinks = new RegExp('^/getAllExternalLinks/.*$');
var getTweet = new RegExp('^/getTweet/id=(\\d+)/.*$');
var getUserInfo = new RegExp('^/getUserInfo/screenName=(\\w+)/.*$');

function buildAllTweetsRes(res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    for (var i = 0; i < json.length; i++) {
        var tweet = json[i];
        res.write('Tweet: ' + JSON.stringify(tweet.text).split('\"').join('') + '\n');
        res.write('User Name: ' + JSON.stringify(tweet.user.name).split('\"').join('') + '\n');
        res.write('Location: ' + JSON.stringify(tweet.user.location).split('\"').join('') + '\n');
        res.write('Created At: ' + JSON.stringify(tweet.created_at).split('\"').join('') + '\n');
        break;
    }
    res.end();
}

function buildAllTwitterUserRes(res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var includedUsers = [];
    for (var i = 0; i < json.length; i++) {
        var user = json[i].user;
        if (includedUsers.indexOf(user.id) == -1) {
            res.write('User ID: ' + JSON.stringify(user.id).split('\"').join('') + '\n');
            res.write('User Name: ' + JSON.stringify(user.name).split('\"').join('') + '\n');
            res.write('User Screen Name: ' + JSON.stringify(user.screen_name).split('\"').join('') + '\n');
            res.write('User Location: ' + JSON.stringify(user.location).split('\"').join('') + '\n');
            res.write('User Description: ' + JSON.stringify(user.description).split('\"').join('') + '\n');
            res.write('User URL: ' + JSON.stringify(user.url).split('\"').join('') + '\n\n');
            includedUsers.push(user.id);
        }
    }
    res.end();
}

function buildAllExternalLinksRes(res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('External Links:\n');
    for (var i = 0; i < json.length; i++) {
        var tweet = json[i].text;
        var urls = tweet.match(new RegExp('(https?|ftp)://(www\d?|[a-zA-Z0-9]+)?\.[a-zA-Z0-9-]+(\:|\.)([a-zA-Z0-9.]+|(\d+)?)([/?:].*)?', 'gi'));
        if (urls != null) {
            for (var j = 0; j < urls.length; j++) {
                res.write(urls[j].split('\"').join('') + '\n');
            }
        }
    }
    res.end();
}

function buildTweetRes(res, id) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    for (var i = 0; i < json.length; i++) {
        var tweet = json[i];
        if (tweet.id == id) {
            res.write('Tweet: ' + JSON.stringify(tweet.text).split('\"').join('') + '\n');
            res.write('User Name: ' + JSON.stringify(tweet.user.name).split('\"').join('') + '\n');
            res.write('Location: ' + JSON.stringify(tweet.user.location).split('\"').join('') + '\n');
            res.write('Created At: ' + JSON.stringify(tweet.created_at).split('\"').join('') + '\n\n');
        }
    }
    res.end();
}

function buildUserInfoRes(res, screenName) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    for (var i = 0; i < json.length; i++) {
        var user = json[i].user;
        if (user.screen_name == screenName) {
            res.write('User ID: ' + JSON.stringify(user.id).split('\"').join('') + '\n');
            res.write('User Name: ' + JSON.stringify(user.name).split('\"').join('') + '\n');
            res.write('User Screen Name: ' + JSON.stringify(user.screen_name).split('\"').join('') + '\n');
            res.write('User Location: ' + JSON.stringify(user.location).split('\"').join('') + '\n');
            res.write('User Description: ' + JSON.stringify(user.description).split('\"').join('') + '\n');
            res.write('User URL: ' + JSON.stringify(user.url).split('\"').join('') + '\n');
            break;
        }
    }
    res.end();
}

function handleRequest(req, res) {
    var url = req.url;

    if (url.match(getAllTweets)) {
        buildAllTweetsRes(res);
    } else if (url.match(getAllTwitterUsers)) {
        buildAllTwitterUserRes(res);
    } else if (url.match(getAllExternalLinks)) {
        buildAllExternalLinksRes(res);
    } else if (url.match(getTweet)) {
        var match = url.match(getTweet);
        var id = match[1];
        buildTweetRes(res, id);
    } else if (url.match(getUserInfo)) {
        var match = url.match(getUserInfo);
        var screenName = match[1];
        buildUserInfoRes(res, screenName);
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found\n');
    }
}

http.createServer(handleRequest).listen(3000);
