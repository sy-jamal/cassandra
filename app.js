var express =require('express');
var app = express();

var cassandra = require('cassandra-driver');
var async = require('async');

var client = new cassandra.Client({contactPoints: ['127.0.0.1'], keyspace: 'hw5'});


app.get('/', function(req, res){
	   res.send("Hello World!");
});

app.post('/deposit' ,(req,res)=>{
	const insertQuery = 'INSERT INTO imgs (filename, contents VALUES(?, ?);

	
});
app.listen(8080, '192.168.122.22');
