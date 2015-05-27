var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
	name: String,
	date: Date,
	state: String,
	crag: String,
	style: String,
	grades: String
});

var Request = mongoose.model('request', requestSchema);
module.exports = Request;