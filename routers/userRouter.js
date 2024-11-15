import express from 'express';
import { User } from '../models/userModel.js';

import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/user-info', authMiddleware, async (request, response) => {
	try {
		const user = await User.findById(request.data.userId).select('-password');

		response.status(200).json(user);
	} catch (error) {
		response.status(500).json(error);
	}
});

export default router;
