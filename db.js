import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(`${process.env.MONGO_URI}`, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true,
	ssl: true 
 });

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

