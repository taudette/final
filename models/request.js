var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
	name: String,
	date: Date,
	state: String,
	grades: String,
	crag: String,
	style: String,
	geo: Object
});

var Request = mongoose.model('request', requestSchema);
module.exports = Request;