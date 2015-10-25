var http = require('http');
var fs = require('fs');
var json;
/* Read the json file */
fs.readFile('favs.json', 'utf8',
    function (err, data) {
        if (err) {
            throw err;
        }
        json = JSON.parse(data);
    }
);

/* Creete the server */
http.createServer(handleRequest).listen(3000);

/* Regular expressions used to identify REST API */
var getAllTweets = new RegExp('^/getAllTweets/.*$');
var getAllTwitterUsers = new RegExp('^/getAllTwitterUsers/.*$');
var getAllExternalLinks = new RegExp('^/getAllExternalLinks/.*$');
var getTweet = new RegExp('^/getTweet\\?id=(.*)/.*$');
var getUserInfo = new RegExp('^/getUserInfo\\?screenName=(.*)/.*$');
var getSearchedText = new RegExp('^/searchText\\?target=(.*)/.*$');

/* Build response for all tweets */
function buildAllTweetsRes(res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    for (var i = 0; i < json.length; i++) {
        var tweet = json[i];
        res.write('Tweet ID: ' + JSON.stringify(tweet.id).split('\"').join('') + '\n');
        res.write('Tweet: ' + JSON.stringify(tweet.text).split('\"').join('') + '\n');
        res.write('User Name: ' + JSON.stringify(tweet.user.name).split('\"').join('') + '\n');
        res.write('Created At: ' + JSON.stringify(tweet.created_at).split('\"').join('') + '\n\n');
    }
    res.end();
}

/* Build response for all users */
function buildAllTwitterUserRes(res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var includedUsers = [];
    for (var i = 0; i < json.length; i++) {
        var user = json[i].user;
        if (includedUsers.indexOf(user.id) == -1) {
            res.write('User ID: ' + JSON.stringify(user.id).split('\"').join('') + '\n');
            res.write('User Name: ' + JSON.stringify(user.name).split('\"').join('') + '\n');
            res.write('User Screen Name: ' + JSON.stringify(user.screen_name).split('\"').join('') + '\n');
            res.write('User Location: ' + JSON.stringify(user.location).split('\"').join('') + '\n\n');
            includedUsers.push(user.id);
        }
    }
    res.end();
}

/* Build response for all external links */
function buildAllExternalLinksRes(res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('External Links:\n');
    for (var i = 0; i < json.length; i++) {
        var tweet = json[i].text;
        var urls = tweet.match(new RegExp('(https?|ftp)://(www\d?|[a-zA-Z0-9]+)?\.[a-zA-Z0-9-]+(\:|\.)([a-zA-Z0-9.]+|(\d+)?)([/?:].*)?', 'gi'));
        if (urls != null) {
            for (var j = 0; j < urls.length; j++) {
                var link = urls[j].split('\"').join('');
                res.write('<a href="' + link + '">' + link + '</a>\n');
            }
        }
    }
    res.end();
}

/* Build response for a single tweet */
function buildTweetRes(res, id) {
    if (isBlank(id)) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Please Specify the Tweet ID to Look For.');
        return;
    }

    for (var i = 0; i < json.length; i++) {
        var tweet = json[i];
        if (tweet.id == id) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('Tweet ID: ' + JSON.stringify(tweet.id).split('\"').join('') + '\n');
            res.write('Tweet: ' + JSON.stringify(tweet.text).split('\"').join('') + '\n');
            res.write('User Name: ' + JSON.stringify(tweet.user.name).split('\"').join('') + '\n');
            res.write('User Location: ' + JSON.stringify(tweet.user.location).split('\"').join('') + '\n');
            res.write('User URL: ' + JSON.stringify(tweet.user.url).split('\"').join('') + '\n');
            res.write('User Time Zone: ' + JSON.stringify(tweet.user.time_zone).split('\"').join('') + '\n');
            res.write('Created At: ' + JSON.stringify(tweet.created_at).split('\"').join('') + '\n\n');
            res.end();

            return;
        }
    }
    buildNotFoundRes(res, id);
}

/* Build response for a single user */
function buildUserInfoRes(res, screenName) {
    if (isBlank(screenName)) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Please Specify the User\'s Screen Name to Look For.');
        return;
    }

    var includedUsers = [];
    for (var i = 0; i < json.length; i++) {
        var user = json[i].user;
        if (user.screen_name == screenName && includedUsers.indexOf(user.id) == -1) {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('User ID: ' + JSON.stringify(user.id).split('\"').join('') + '\n');
            res.write('User Name: ' + JSON.stringify(user.name).split('\"').join('') + '\n');
            res.write('User Screen Name: ' + JSON.stringify(user.screen_name).split('\"').join('') + '\n');
            res.write('User Location: ' + JSON.stringify(user.location).split('\"').join('') + '\n');
            res.write('User Description: ' + JSON.stringify(user.description).split('\"').join('') + '\n');
            res.write('User URL: ' + JSON.stringify(user.url).split('\"').join('') + '\n');
            includedUsers.push(user.id);
        }
    }
    if (includedUsers.length == 0) {
        buildNotFoundRes(res, screenName);
    }
    res.end();
}

/* Build response for the result of search */
function buildSearchTextRes(res, target) {
    var searchTextReg = new RegExp('^.*' + target + '.*$');

    res.writeHead(200, {'Content-Type': 'text/html'});
    if (!isBlank(target)) {
        for (var i = 0; i < json.length; i++) {
            var tweet = json[i];
            var text = tweet.text;
            if (text.match(searchTextReg)) {
                var matchedText = JSON.stringify(text).split('\"').join('');
                matchedText = matchedText.split(target).join('<span style="background-color: yellow">' + target + '</span>');
                res.write('Tweet ID: ' + JSON.stringify(tweet.id).split('\"').join('') + '\n');
                res.write('Tweet: ' + matchedText + '\n');
                res.write('User Name: ' + JSON.stringify(tweet.user.name).split('\"').join('') + '\n');
                res.write('Created At: ' + JSON.stringify(tweet.created_at).split('\"').join('') + '\n\n');
            }
        }
    }
    res.end();
}

/* Chech if string is empty */
function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

/* Build reponse for result not found */
function buildNotFoundRes(res, filter) {
    if (filter) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<!doctype html><html><head><title>404</title></head><body>Tweet ID or Screen Name \'' + filter + '\' Cannot be Found</body></html>');
        res.end();
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.write('<!doctype html><html><head><title>404</title></head><body>Source Not Found</body></html>');
        res.end();
    }
}

/* Main function used to handle request and build response */
function handleRequest(req, res) {
    var url = req.url;
    if (req.headers['x-requested-with'] == 'XMLHttpRequest') {
        /* If incoming request is AJAX call */
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
        } else if (url.match(getSearchedText)) {
            var match = url.match(getSearchedText);
            var target = match[1];
            /* Convert some of the special chars */
            target = target.split('%20').join(' ');
            target = target.split('%27').join('\'');
            target = target.split('%22').join('\"');
            buildSearchTextRes(res, target);
        } else {
            buildNotFoundRes(res);
        }
    } else {
        switch (url) {
            case '/':
                /* Request for the main page */
                fs.readFile('index.html',function (err, data) {
                    res.writeHead(200, {'Content-Type': 'text/html','Content-Length': data.length});
                    res.write(data);
                    res.end();
                });
                break;
            case '/requests.js':
                /* Requesr for the client-side javascript */
                fs.readFile('requests.js',function (err, data) {
                    res.writeHead(200, {'Content-Type': 'text/javascript','Content-Length': data.length});
                    res.write(data);
                    res.end();
                });
                break;
            case '/index.css':
                /* Request for the client-side css */
                fs.readFile('index.css',function (err, data) {
                    res.writeHead(200, {'Content-Type': 'text/css','Content-Length': data.length});
                    res.write(data);
                    res.end();
                });
                break;
            case '/jquery-1.6.2.min.js':
                /* Request for the jquery library */
                fs.readFile('jquery-1.6.2.min.js',function (err, data) {
                    res.writeHead(200, {'Content-Type': 'text/javascript','Content-Length': data.length});
                    res.write(data);
                    res.end();
                });
                break;
            default:
                buildNotFoundRes(res);
        }
    }
}
