import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(`${process.env.DB_PATH}/mern-auth`);

export const db = mongoose.connection;

db.on('connected', () => {
	console.log('MongoDB database is connected');
});
db.on('disconnected', () => {
	console.log('MongoDB database is disconnected');
});
db.on('error', () => {
	console.log('Something went wrong with mongodb connection');
});

