var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');
var apiController = require('./controllers/api.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/final');
//seed DB
require('./models/seeds/postSeed.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', indexController.index);
app.get('/templates/:templateName', indexController.templates);
app.post('/api', indexController.addRequest);
app.get('/api', indexController.getAll);

var server = app.listen(3735, function() {
	console.log('Express server listening on port ' + server.address().port);
});
