import express from 'express';
import authRouter from './routers/authRouter.js';
import userRouter from './routers/userRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js';
import petsRouter from './routers/petRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(
	cors()
);

app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/pets', petsRouter);
app.use('/uploads', express.static('uploads'));

app.get('/', (request, response) => {
	response.status(200).send('Welcome to API');
});

app.listen(`${process.env.PORT}`, () => {
	console.log('Server started');
});
