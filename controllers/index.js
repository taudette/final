var Request = require('../models/request.js');
var indexController = {
	index: function(req, res) {
		res.render('index');
	},
	templates: function(req, res){
		res.render('templates/' + req.params.templateName);
	},

	addRequest: function(req, res){
		var request = new Request(req.body);
		console.log(request);
		request.save(function(err, result){
			res.send(result);
		});
	},
	getAll : function(req, res){
		Request.find({}, function(err, results){		
			res.send(results);

		});
	}
};

module.exports = indexController;