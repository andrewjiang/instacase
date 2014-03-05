var express = require('express');
var app = express();

// Views
app.get('/', function(req, res) {
    res.send('wut!');
});

var server = app.listen(8080, function() {
    console.log('Listening on port %d', server.address().port);
});
