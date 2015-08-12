exports.notFound = function notFound(req, res, next){
	res.status(404).send('resource not found');
};

exports.error = function error(err, req, res, next){
	console.log(err);
	res.status(500).send('internal server error');
};