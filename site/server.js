var ssl = false; 
var express = require('express');
var app = express();
var fs = require('fs');
if(ssl === false){
    var server = require('http').createServer(app);
}else{
    var privateKey = fs.readFileSync(__dirname  + '/ssl/localhost.key').toString();
    var certificate = fs.readFileSync(__dirname + '/ssl/localhost.pem').toString();
    var options = {
      key : privateKey,
      cert : certificate
    };
    var server = require('https').createServer(options,app); 
}
var webRTC = require('webrtc.io').listen(server);
var port = process.env.PORT || 8080;
server.listen(port);

var username = "username";
var password = "password";

var auth = express.basicAuth(function (user, pass) {
    return (user == username && pass == password);
}, 'to use this application , please login first !');

app.get('/', auth, function (req, res) {
    res.sendfile(__dirname + '/index.html');
    console.log(req.connection.remoteAddress + " has joined the chat !");
});
app.get('/css/style.css', auth, function (req, res) {
    res.sendfile(__dirname + '/css/style.css');
});
app.get('/js/jquery.min.js', auth, function (req, res) {
    res.sendfile(__dirname + '/js/jquery.min.js');
});
app.get('/js/script.js', auth, function (req, res) {
    res.sendfile(__dirname + '/js/script.js');
});
app.get('/js/webrtc.io.js', auth, function (req, res) {
    res.sendfile(__dirname + '/js/webrtc.io.js');
});

console.log("server running on 0.0.0.0:" + port);
