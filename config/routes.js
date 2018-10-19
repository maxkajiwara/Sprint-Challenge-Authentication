const axios = require('axios');
const bcrypt = require('bcryptjs');
const db = require('../database/dbConfig');
const jwt = require('jsonwebtoken');

const jwtKey = require('../_secrets/keys').jwtKey;

const { authenticate } = require('./middlewares');

module.exports = server => {
	server.post('/api/register', register);
	server.post('/api/login', login);
	server.get('/api/jokes', authenticate, getJokes);
};

// generate jwt token
function generateToken(userId) {
	const jwtPayload = { userId };
	const jwtOptions = {
		expiresIn: '1d'
	};

	return jwt.sign(jwtPayload, jwtKey, jwtOptions);
}

// register
function register(req, res) {
	const { username, password } = req.body;
	const credentials = { username, password };

	const hash = bcrypt.hashSync(credentials.password, 12);
	credentials.password = hash;

	db('users')
		.insert(credentials)
		.then(([id]) => {
			const token = generateToken(id);
			res.status(201).json({
				message: `User account ${credentials.username} created`,
				token
			});
		})
		.catch(err => {
			res.status(500).json(err);
		});
}

// login
function login(req, res) {
	const credentials = req.body;

	db('users')
		.where({ username: credentials.username })
		.then(([user]) => {
			if (user && bcrypt.compareSync(credentials.password, user.password)) {
				const token = generateToken(user);
				res
					.status(200)
					.json({ message: `User ${credentials.username} logged in`, token });
			} else {
				res.status(401).json({ error: 'Not authorized' });
			}
		})
		.catch(err => res.status(500).json(err));
}

function getJokes(req, res) {
	axios
		.get(
			'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten'
		)
		.then(response => {
			res.status(200).json(response.data);
		})
		.catch(err => {
			res.status(500).json({ message: 'Error Fetching Jokes', error: err });
		});
}
