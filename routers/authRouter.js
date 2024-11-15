import express from 'express';
import { User } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (request, response) => {
	try {
		const { username, email, password } = request.body;

		const existingUsername = await User.findOne({ username });

		if (existingUsername) {
			return response
				.status(400)
				.json({ message: 'Username is already exists' });
		}

		const existingEmail = await User.findOne({ email });

		if (existingEmail) {
			return response.status(400).json({ message: 'Email is already exists' });
		}

		const hashPassword = await bcrypt.hash(password, 10);

		const newUserData = {
			username,
			email,
			password: hashPassword,
		};

		const newUser = new User(newUserData);

		await newUser.save();

		response.status(200).json({ message: 'User registered successfully' });
	} catch (error) {
		response.status(500).json(error);
	}
});

router.post('/login', async (request, response) => {
	try {
		const { username, password } = request.body;
		const user = await User.findOne({ username });

		if (!user) {
			return response.status(400).json({ message: 'User not found' });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return response.status(400).json({ message: 'Incorrect password' });
		}

		const token = jwt.sign(
			{ userId: user._id, username: user.username },
			process.env.JWT_SECRET,
			{ expiresIn: '30d' }
		);

		response.status(200).json({ token });
	} catch (error) {
		response
			.status(500)
			.json({ message: 'Something went wrong while login ', error });
	}
});

export default router;
