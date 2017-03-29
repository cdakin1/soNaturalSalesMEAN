const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 9000;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const app = express();
const User = require('./user-model.js');
const secrets = require('./secrets.js');


app.use(express.static('client'));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

secrets.connection;

const db = mongoose.connection;
const Schema = mongoose.Schema;

db.on('error', console.error.bind(console, 'connection error:'));

//Users
// var testUser = new User({
//     username: 'jmar777',
//     password: 'Password123'
// });
//
// // save user to database
// testUser.save(function(err) {
//     if (err) throw err;
//
//     // fetch user and test password verification
//     User.findOne({ username: 'jmar777' }, function(err, user) {
//         if (err) throw err;
//
//         // test a matching password
//         user.comparePassword('Password123', function(err, isMatch) {
//             if (err) throw err;
//             console.log('Password123:', isMatch); // -> Password123: true
//         });
//
//         // test a failing password
//         user.comparePassword('123Password', function(err, isMatch) {
//             if (err) throw err;
//             console.log('123Password:', isMatch); // -> 123Password: false
//         });
//     });
// });

app.post('/newUser', function(req, res) {
	let body = req.body;
	let newUser = new User({
		username: body.username,
		password: body.password
	});
	newUser.save(function(err, newDemo) {
		if(err) return console.error(err);
	});
});



//Posts

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
