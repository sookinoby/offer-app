var express = require('express');
var bcrypt = require('bcryptjs');

module.exports = {

unSecure : function(req,res,next){
	var result = ["acessing","unsecure resourse","finally"];
	res.status(200).send(JSON.stringify(result));
}

}
