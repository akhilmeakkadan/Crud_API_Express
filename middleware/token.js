function Token(req,res,next) {
	console.log('Middleware');
	next();
	return;
}

module.exports=Token;