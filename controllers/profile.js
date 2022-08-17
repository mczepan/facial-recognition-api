export const profileGetHandler = (req, res, db) => {
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
};
