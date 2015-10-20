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
var getTweet = new RegExp('^/getTweet/id=(\\d*)/.*$');
var getUserInfo = new RegExp('^/getUserInfo/screenName=(\\w*)/.*$');

function buildAllTweetsRes(res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    for (var i = 0; i < json.length; i++) {
        var tweet = json[i];
        res.write('Tweet: ' + JSON.stringify(tweet.text).split('\"').join('') + '\n');
        res.write('User Name: ' + JSON.stringify(tweet.user.name).split('\"').join('') + '\n');
        res.write('Location: ' + JSON.stringify(tweet.user.location).split('\"').join('') + '\n');
        res.write('Created At: ' + JSON.stringify(tweet.created_at).split('\"').join('') + '\n\n');
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
    for (var i = 0; i < json.length; i++) {
        var tweet = json[i];
        if (tweet.id == id) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('Tweet: ' + JSON.stringify(tweet.text).split('\"').join('') + '\n');
            res.write('User Name: ' + JSON.stringify(tweet.user.name).split('\"').join('') + '\n');
            res.write('Location: ' + JSON.stringify(tweet.user.location).split('\"').join('') + '\n');
            res.write('Created At: ' + JSON.stringify(tweet.created_at).split('\"').join('') + '\n\n');
            break;
        } else if (i == json.length - 1) {
            buildNotFoundRed(res);
        }
    }
    res.end();
}

function buildUserInfoRes(res, screenName) {
    for (var i = 0; i < json.length; i++) {
        var user = json[i].user;
        if (user.screen_name == screenName) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('User ID: ' + JSON.stringify(user.id).split('\"').join('') + '\n');
            res.write('User Name: ' + JSON.stringify(user.name).split('\"').join('') + '\n');
            res.write('User Screen Name: ' + JSON.stringify(user.screen_name).split('\"').join('') + '\n');
            res.write('User Location: ' + JSON.stringify(user.location).split('\"').join('') + '\n');
            res.write('User Description: ' + JSON.stringify(user.description).split('\"').join('') + '\n');
            res.write('User URL: ' + JSON.stringify(user.url).split('\"').join('') + '\n');
            break;
        } else if (i == json.length - 1) {
            buildNotFoundRed(res);
        }
    }
    res.end();
}

function buildNotFoundRed(res) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write('<!doctype html><html><head><title>404</title></head><body>404: Resource Not Found</body></html>');
    res.end();
}

function handleRequest(req, res) {
    var url = req.url;
    if (req.headers['x-requested-with'] == 'XMLHttpRequest') {
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
            // 404 Not Found
            buildNotFoundRed(res);
        }
    } else {
        switch (url) {
            case '/':
                fs.readFile('index.html',function (err, data) {
                    res.writeHead(200, {'Content-Type': 'text/html','Content-Length': data.length});
                    res.write(data);
                    res.end();
                });
                break;
            case '/requests.js':
                fs.readFile('requests.js',function (err, data) {
                    res.writeHead(200, {'Content-Type': 'text/javascript','Content-Length': data.length});
                    res.write(data);
                    res.end();
                });
                break;
            default:
                // 404 Not Found
                buildNotFoundRed(res);
        }
    }
}

http.createServer(handleRequest).listen(3000);
