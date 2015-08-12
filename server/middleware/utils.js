var jwt = require('jsonwebtoken');
var config = require('../config');
var moment = require('moment');
var User = require('../model/user');
exports.createToken = function createToken(user,cb) {
  var payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user._id
  };
    var token = jwt.sign(payload,config.tokenSecret);
    cb(null,token);
}

exports.isAuthenicated = function isAuthenticated(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).send({ message: 'You did not provide a JSON Web Token in the Authorization header.' });
  }
  console.log(req.headers.authorization);
  var header = req.headers.authorization.split(' ');
  var token = header[1];
 
  var now = moment().unix();

  jwt.verify(token, config.tokenSecret, function (err, decoded) {
        if (err) {
            return console.error(err.name, err.message);
            return res.status(500).send({message: 'Internal server error'});
        } else {
         if (now >= decoded.exp) {
    		return res.status(401).send({ message: 'Token has expired.' });
  		 }

  		User.findById(decoded.sub, function(err, user) {
    	if (!user) {
      	return res.status(400).send({ message: 'User no longer exists.' });
    	}
		req.user = user;
    	next();
  		});
        }
    });
}