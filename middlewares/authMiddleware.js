import jwt from 'jsonwebtoken';

export const authMiddleware = (request, response, next) => {
	const token = request.header('x-auth-token');

	if (!token) {
		return response
			.status(401)
			.json({ message: 'No Token, authorization denied' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		request.data = decoded; 

		next();
	} catch (error) {
		return response.status(401).json({ message: 'Token is not valid' });
	}
};

