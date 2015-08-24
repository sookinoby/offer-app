var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../model/user');
var utils = require('../middleware/utils');
var sleep = require('sleep');
module.exports = {
view : function(req, res, next) {
  res.send('respond with a resource');
},

  isUnique : function(req,res){
     console.log(req.query.email);
    User.findOne({ email: req.query.email }, function(err, existingUser) {
      if(!req.query.email || req.query.email == "" )
      {
        return res.sendStatus(400);
      }
      else if (existingUser) {
       return res.sendStatus(409);
      }
      else {
        res.sendStatus(200);
      }
    });
  },

  signup : function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
         return res.sendStatus(409);
    }
    console.log("testing" + req.body.userName);
     console.log("Something" + req.body.email);
    var user = new User({
      email: req.body.email,
      password: req.body.password,
      userName: req.body.userName
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;

        user.save(function() {
        	 console.log("save called");
          var responseToSend =  function response(err,token){
          if(err)
          	res.status(500).send("{error:something went wrong}");
          else {
             res.status(200).send({ token: token, email: user.email });
          	 }
      	  }
      		
      	   console.log("create token called");
      	   var token = utils.createToken(user,responseToSend);
      	 	
          });
        });
      });
    });
  },

  login : function(req, res) {
    console.log(req.body.email  + " " + req.body.password);
      console.log("hit");
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      console.log("username invalid")
      return res.status(401).send({ message: { email: 'Incorrect email' } });
    }

    bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
      if (!isMatch) {
       console.log("password invalid");
        return res.status(401).send({ message: { password: 'Incorrect password' } });
      }

      user = user.toObject();
      delete user.password;
      var responseToSend =  function response(err,token){
      if(err)
      res.status(500).send("{error:something went wrong}");
      else {
      res.status(200).send({ token: token, userName: user.userName });
        }
      } 
      var token = utils.createToken(user,responseToSend);
      
    });
  });
}



}

