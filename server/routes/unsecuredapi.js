var express = require('express');
var router = express.Router();


router.get('/', function(req,res,next){
	var result = ["test","abc","efg"];
res.send(JSON.stringify(result));
});



module.exports = router;
