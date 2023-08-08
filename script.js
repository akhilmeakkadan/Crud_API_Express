const express	= require("express");//imported package but it is a methid too
const app     	= express(); // need to define ina var because it is a method
const path 	  	= require("path"); 
const Token 	= require("./middleware/token");
const mongoose	= require("mongoose");
const Product 	= require('./models/Product');
const multer 	= require('multer');
const upload 	= multer();
const middleware= [Token];// you can define multiple middleware comma separated here.

app.use(appMiddleware);
mongoose.set("strictQuery", false);

//Local DB
mongoose.connect("mongodb://localhost:27017/latestdb",{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).
then(()=>{console.log("Mongoose server has started")
})
.catch((err)=>{
    console.error(err)
})

//Calling app middleware by default here
app.get("/",(req,res)=> { 
	res.sendFile(path.join(__dirname,"views","index.html"));
});

app.get("/contact",(req,res)=> { 
	res.sendFile(path.join(__dirname,"views","contact.html"));
});
//Calling custom middleware
app.get("/products",middleware,async (req,res)=> {  
	const Items = await Product.find({}).select("name price weight");
	if(typeof Items !== 'undefined' && Items.length > 0){
		res.json({"status":200,"data":{"Products":Items},"message":"Product data found"}); 
	}else{
		res.json({"status":200,"data":{"Products":[{}]},"message":"No data found"}); 
	}
});

app.get("/products/:productId",middleware,async (req,res)=> {
  	let productUid = req.params.productId;
  	const Item = await Product.findOne({_id: productUid}).select("name price weight");
	if(typeof Item !=='undefined' && Object.keys(Item).length !== 0){
		res.json({"status":200,"data":{"Product":Item},"message":"Product data founds"});
	}else{
		res.json({"status":200,"data":{"Products":[{}]},"message":"No data found"});
	}
});
app.post("/products",middleware,upload.none(),async (req,res)=> {
	var pName = req.body.name;
	var pPrice = req.body.price;
	var pUtility = new Array(req.body.utility);
	var pWeight = req.body.weight;
	var pOnsale = req.body.on_sale; 
	let req_data =  {
	    name: pName,
	    price: pPrice,
	    utility: pUtility,
	    weight: pWeight,
	    onSale: pOnsale
	};
	const product =  Product.create(req_data).
		then(()=>{res.json({"status":200,"data":{"Products":{}},"message":"Product added successfully."});
	}).
	catch((error) => {
		if(error){
			res.status(500); 
	   		res.json({"status":500,"data":{"Products":[{}]},"message":"Error while adding product"});
		}
	});
});
app.delete("/products/:productId",middleware,upload.none(),async (req,res)=> {
	let produtId = req.params.productId;
	let delte_condition = {_id:produtId};
	let isDelete = await Product.deleteOne(delte_condition);
	if(isDelete.acknowledged && isDelete.deletedCount==1){
		res.json({"status":200,"data":{"Products":[{}]},"message":"Product has been deleted successfully."});
	}else{
		res.status(500); 
		res.json({"status":500,"data":{"Products":[{}]},"message":"Error while deleting product"});
	}
});

app.put("/products/:productId",middleware,upload.none(),async (req,res)=> {
	let produtId = req.params.productId;
	console.log(req.body);
	var pName = req.body.name;
	var pPrice = req.body.price;
	var pUtility = new Array(req.body.utility);
	var pWeight = req.body.weight;
	var pOnsale = (req.body.on_sale) ? true :false;
	let req_data =  {
	    name: pName,
	    price: pPrice,
	    utility: pUtility,
	    weight: pWeight,
	    onSale: pOnsale
	};
	let isUpdate = await Product.findByIdAndUpdate({_id:produtId}, req_data);
	if(isUpdate.updatedAt){
		res.json({"status":200,"data":{"Products":[{}]},"message":"Product has been updated successfully."});
	}else{
		res.json({"status":500,"data":{"Products":[{}]},"message":"Error while updating product"});
	}
});

app.get("*",(req,res)=>{
	res.status(404);
	res.json({"status":404,"data":[{}],"message":"Page not found"});
	//res.status(404).send("<h1>Not Found</h1>");//chaining method
});

//app.use(express.static("views"));  // We can use "http://localhost:3001/index.html" here we are serving as static
//We can set this as app middleware and this will invoke in all functiions
function appMiddleware(req,res,next){
	console.log(new Date());
	next();
}
const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>console.log(`Server is running: ${PORT}`));
