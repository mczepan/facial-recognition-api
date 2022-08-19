import express, { response } from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import { handleRegister } from './controllers/register.js';
import { signinHandler } from './controllers/signin.js';
import { profileGetHandler } from './controllers/profile.js';
import { imageHandler } from './controllers/image.js';
import { handleApiCall } from './controllers/image.js';

const app = express();

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1', //localhost
		user: 'postgres', //add your user name for the database here
		port: 5432, // add your port number here
		password: 'admin', //add your correct password in here
		database: 'smart_brain', //add your database name you created here
	},
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	db.select('*')
		.from('users')
		.then((users) => res.json(users));
});

app.post('/signin', (req, res) => signinHandler(req, res, db, bcrypt));

app.post('/register', (req, res) => handleRegister(req, res, db, bcrypt));

app.get('/profile/:userId', (req, res) => profileGetHandler(req, res, db));

app.put('/image/:userId', (req, res) => imageHandler(req, res, db));
app.post('/imageUrl', (req, res) => handleApiCall(req, res));

app.listen(process.env.PORT || 3001);
