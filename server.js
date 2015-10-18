var http = require('http');
var fs = require('fs');
var json;
fs.readFile('favs.json', 'utf8',
    function (err, data) {
        if (err) {
            throw err;
        }
        json = JSON.parse(data);
        console.log(data);
    }
);

var getAllTweets = new RegExp('^/getAllTweets/.*$');
var getAllTwitterUsers = new RegExp('^/getAllTwitterUsers/.*$');
var getAllExternalLinks = new RegExp('^/getAllExternalLinks/.*$');
var getTweet = new RegExp('^/getTweet/id=(\\d+)/.*$');
var getUserInfo = new RegExp('^/getUserInfo/userName=(\\w+)/.*$');

function handleRequest(req, res) {
    var url = req.url;

    if (url.match(getAllTweets)) {
        console.log( "JSON Data: " + json);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('All Tweets');
        res.end(json);

    } else if (url.match(getAllTwitterUsers)) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('All Users');
    } else if (url.match(getAllExternalLinks)) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('All Links');
    } else if (url.match(getTweet)) {
        var match = url.match(getTweet);
        var id = match[1];
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Tweet ' + id);
    } else if (url.match(getUserInfo)) {
        var match = url.match(getUserInfo);
        var userName = match[1];
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('User Info ' + userName);
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found\n');
    }
}

http.createServer(handleRequest).listen(3000);

// console.log('Server running at http://127.0.0.1:3000/');