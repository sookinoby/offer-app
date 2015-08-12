module.exports = {

secure : function(req,res,next){
	var result = ["acessing","secure Resource","finally"];
res.send(JSON.stringify(result));
}

}