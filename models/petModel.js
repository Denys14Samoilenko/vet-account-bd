import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
    },
	 type: {
		type: String,
		enum: ['Собака', 'Кіт', 'Птах', 'Рептилія', 'Рибки', 'Інше'],
		required: true, 
	},
	breed: {
		type: String, 
  },
    age: {
        type: Number,
        required: true, 
	},
	photo: {
		type: String, 
  },
    createdAt: {
        type: Date,
        default: Date.now, 
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true, 
  },
});


export const Pet = mongoose.model('Pet', petSchema);
