var express =require('express');
var app = express();

const bodyParser= require('body-parser');
const multer = require('multer');
app.use(bodyParser.urlencoded({extended: true}));

var cassandra = require('cassandra-driver');
var async = require('async');
var Blob = require('blob');

var fs = require('fs')

var path = require('path');

var client = new cassandra.Client({contactPoints: ['127.0.0.1'],localDataCenter: 'datacenter1', keyspace: 'hw5'});

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
 

app.get('/', function(req, res){
	   res.send("Hello World!");
});

app.post('/deposit' ,upload.single('contents'),(req,res)=>{
	
	
	const insertQuery = 'INSERT INTO imgs (filename, contents) VALUES(?, ?)';
	const params = [req.body.filename, req.file.buffer];
	client.execute(insertQuery, params, {prepare:true})
	.then(result =>{
		return res.json({status:"OK", message: "Saved in DB" });
	})
	.catch(err=>{
		return res.json({status:"error", error: err });		
	});
	
	
});

app.get('/retrieve',upload.none(), (req, res)=>{
	console.log('inside retrieve');
	console.log(req.query.filename);
	const selectQuery = 'SELECT * FROM imgs WHERE filename = ?';
	client.execute(selectQuery, [req.query.filename])
	.then(result=>{
		console.log('fileName is :', result.first().contents)

		fs.writeFile(req.query.filename,  new Buffer(result.first().contents, "base64"), function(err){
			if(err)
			{
				console.log('error creating file');
				return res.json({status:"error", error: err, message:"not creating file" });
			}
			else
			{
				console.log(path.extname(__dirname +'/'+ req.query.filename));
				//  res.set('Content-Type', path.extname(__dirname +'/'+ req.body.filename));
				res.type(path.extname(__dirname +'/'+ req.query.filename));

				return res.sendFile(__dirname +'/'+ req.query.filename);
			}
		})		
				
	})
	.catch(err=>{
		return res.json({status:"error", error: err });
	})

});
app.listen(8080, '192.168.122.22');
