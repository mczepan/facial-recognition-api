import Clarifai from 'clarifai';

const app = new Clarifai.App({
	apiKey: 'b8711d1c85db4bc482015e113b32a0b8',
});

export const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then((data) => res.json(data))
		.catch((err) =>
			res.status(400).json({ message: "can't find any face on img" })
		);
};

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
