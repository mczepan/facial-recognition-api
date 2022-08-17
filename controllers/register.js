export const handleRegister = (req, res, db, bcrypt) => {
	console.log('req', req);
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
};
