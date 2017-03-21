const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 9000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const app = express();
const secrets = require('./secrets.js');

app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

console.log(secrets);

secrets.connection;

const db = mongoose.connection;
const Schema = mongoose.Schema;

db.on('error', console.error.bind(console, 'connection error:'));


const postSchema = new Schema({
	line: String,
	store: String,
	date: Date,
	time: Array,
	month: Number,
	comments: String
});

var Post = mongoose.model('Post', postSchema);

app.get('/', function(req, res){
	res.render('client/index.html');
});

app.get('/demos', function(req, res) {
	// let test;
	const today = new Date();
	const month = today.getMonth();
	Post.find({ month: {$gte: month} }, function(err, posts) {
		if(err) console.error(err);
		console.log(posts)
		res.json(posts);
	});
});


app.post('/newDemo', function(req, res) {
	let demo = req.body;
	let newDemo = new Post({
		line: demo.line,
		store: demo.store,
		date: demo.date,
		time: demo.time,
		month: demo.month,
		comments: demo.comments
	});
	newDemo.save(function(err, newDemo) {
		if(err) return console.error(err);
	});
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
