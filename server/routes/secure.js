var express = require('express');
var router = express.Router();


router.get('/', function(req,res,next){
	var result = ["acessing","secure Resource","finally"];
res.send(JSON.stringify(result));
res.send('you are authenicated to access the resource');
});



module.exports = router;
