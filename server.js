import express, { response } from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

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

app.post('/signin', (req, res) => {
	db.select('email', 'hash')
		.where({ email: req.body.email })
		.from('login')
		.then((data) => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				db('users')
					.select('*')
					.from('users')
					.where({ email: req.body.email })
					.then((user) => {
						res.json(user[0]);
					})
					.catch((err) => res.status(400).json({ message: "can't get user" }));
			} else {
				res.status(400).json({ message: 'invalid credentials' });
			}
		})
		.catch((err) => res.status(400).json({ message: 'invalid credentials' }));
});

app.post('/register', (req, res) => {
	const { name, email, password } = req.body;

	// bcrypt.hash(password, null, null, (err, hash) => console.log(hash));

	if (name && email && password) {
		const hash = bcrypt.hashSync(password);
		db.transaction((trx) => {
			trx
				.insert({
					hash,
					email,
				})
				.into('login')
				.returning('email')
				.then((loginEmail) => {
					console.log(loginEmail, 'loginEmail');
					db('users')
						.returning('*')
						.insert({ name, email: loginEmail[0].email, joined: new Date() })
						.then((user) => res.json(user[0]));
				})
				.then(trx.commit)
				.catch(trx.rollback);
		}).catch((err) =>
			res.status(400).json({ message: 'something went wrong' })
		);
	} else {
		res.status(400).json({ message: 'fill all fields' });
	}
});

app.get('/profile/:userId', (req, res) => {
	const { userId } = req.params;

	db.select('*')
		.from('users')
		.where({ id: userId })
		.first()
		.then((user) => {
			if (user) {
				res.json(user);
			} else {
				res.status(404).json({ message: 'user with provided id not exist' });
			}
		})
		.catch((err) =>
			res.status(404).json({ message: 'user with provided id not exist' })
		);
});

app.put('/image/:userId', (req, res) => {
	const { userId } = req.params;

	db('users')
		.increment('entries')
		.where('id', userId)
		.returning('*')
		.then((user) => {
			res.json(user[0]);
		})
		.catch((err) => res.status(400).json({ message: 'something went wrong' }));
});

app.listen(3001);
