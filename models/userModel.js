import mongoose from 'mongoose';

const userSchema = {
	username: {
		type: String,
		unique: true,
		require: true,
	},
	email: {
		type: String,
		unique: true,
		require: true,
	},
	password: {
		type: String,
		require: true,
	},
};

export const User = new mongoose.model('User', userSchema);
