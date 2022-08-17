export const imageHandler = (req, res, db) => {
	const { userId } = req.params;

	db('users')
		.increment('entries')
		.where('id', userId)
		.returning('*')
		.then((user) => {
			res.json(user[0]);
		})
		.catch((err) => res.status(400).json({ message: 'something went wrong' }));
};
