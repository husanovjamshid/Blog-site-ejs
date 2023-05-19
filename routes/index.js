var express = require('express');
var router = express.Router();
const { read, write } = require('../util/model.js');
const jwt = require('jsonwebtoken');
const users = require('../db/users.json');
const data = require('../db/news.json');
/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { news: read('news') });
});

router.get('/news', (req, res) => {
	if (req.params.id) {
		const newData = data.find((item) => item.id == req.params.id);
		res.status(200).send(newData);
	} else {
		res.status(200).send(data);
	}
});

router.delete('/news/:id', (req, res) => {
	const { id } = req.params;
	const newData = data.findIndex((item) => item.id == id);
	data.splice(newData, 1);

	write('news', data);
	res.status(200).send(data);
});

router.put('/news/:userId', (req, res) => {
	const { title, desc } = req.body;
	const { userId } = req.params;
	const newData = data.find((item) => item.id == userId);
	newData.title = title || newData.title;
	newData.desc = desc || newData.desc;

	write('news', data);
	res.status(201).send(data);
});

router.post('/news', (req, res) => {
	const { title, desc } = req.body;
	const newData = {
		id: data.at(-1)?.id + 1 || 1,
		title,
		desc,
		date: new Date(),
	};
	data.push(newData);

	write('news', data);
	res.status(201).send(data);
});

router.get('/admin', function (req, res, next) {
	res.render('admin', { news: read('news') });
});

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', (req, res) => {
	try {
		// res.cookie('token', 'olma').redirect('/admin');
		const { username, password } = req.body;
		console.log(username);

		const user = users.find(
			(item) => item.username == username && item.password == password,
		);

		if (!user) {
			throw new Error('Wrong username or password');
		}
		res.redirect('/admin');
		req.headers['token'] = jwt.sign(username, process.env.SECRET_KEY);
		// console.log(req.headers);
		res.status(200).json({
			status: 200,
			message: 'success',
			token: jwt.sign(username, process.env.SECRET_KEY),
		});
	} catch (error) {
		res.status(404).send({ status: 404, message: error.message });
	}
});

// router.get('/style.css', function(req, res, next) {
//   res.sendFile('../public/stylesheets/style.css');
// });

// router.get('/login', function (req, res, next) {
// 	res.render('index', { title: 'dasdasd' });
// });

module.exports = router;
