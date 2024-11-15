import express from 'express';
import multer from 'multer';
import { Pet } from '../models/petModel.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const petsRouter = express.Router();

const upload = multer({ dest: 'uploads/' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDirectory = path.join(__dirname, 'uploads');

petsRouter.post('/add', upload.single('photo'), async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1];
	if (!token) {
		return res.status(403).json({ message: 'Токен не предоставлен' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const { name, type, breed, age } = req.body;
		const photo = req.file?.filename;

		const newPet = new Pet({
			name,
			type,
			breed,
			age,
			photo,
			owner: decoded.userId,
		});
		await newPet.save();

		res.status(201).json({ message: 'Pet added successfully', pet: newPet });
	} catch (error) {
		res.status(500).json({ message: 'Failed to add pet', error });
	}
});

petsRouter.get('/', async (req, res) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];
		if (!token) {
			return res.status(403).json({ message: 'Токен не предоставлен' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const pets = await Pet.find({ owner: decoded.userId });

		res.status(200).json(pets);
	} catch (error) {
		res.status(500).json({ message: 'Ошибка получения питомцев', error });
	}
});

petsRouter.get('/:id', async (req, res) => {
	try {
		const pet = await Pet.findById(req.params.id);
		if (!pet) return res.status(404).json({ message: 'Pet not found' });

		res.status(200).json(pet);
	} catch (error) {
		res.status(500).json({ message: 'Failed to retrieve pet', error });
	}
});

petsRouter.patch('/:id', upload.single('photo'), async (req, res) => {
	try {
		const updatedData = req.body;

		if (req.file) {
			updatedData.photo = req.file.filename;

			const pet = await Pet.findById(req.params.id);

			if (pet && pet.photo) {
				const uploadsDirectory = path.join(__dirname, '..', 'uploads');
				const oldImagePath = path.join(uploadsDirectory, pet.photo);

				fs.access(oldImagePath, fs.constants.F_OK, (err) => {
					if (err) {
						console.log('File does not exist:', oldImagePath);
					} else {
						fs.unlink(oldImagePath, (err) => {
							console.error('Failed to delete old image:', err);
						});
					}
				});
			}
		}

		const updatedPet = await Pet.findByIdAndUpdate(req.params.id, updatedData, {
			new: true,
			runValidators: true,
		});

		if (!updatedPet) return res.status(404).json({ message: 'Pet not found' });

		res
			.status(200)
			.json({ message: 'Pet updated successfully', pet: updatedPet });
	} catch (error) {
		res.status(500).json({ message: 'Failed to update pet', error });
	}
});

petsRouter.delete('/:id', async (req, res) => {
	try {
		const pet = await Pet.findById(req.params.id);

		if (!pet) return res.status(404).json({ message: 'Pet not found' });

		if (pet.photo) {
			const uploadsDirectory = path.join(__dirname, '..', 'uploads');
			const imagePath = path.join(uploadsDirectory, pet.photo);

			fs.access(imagePath, fs.constants.F_OK, (err) => {
				if (!err) {
					fs.unlink(imagePath, (err) => {
						console.error('Failed to delete photo:', err);
					});
				}
			});
		}
		const deletedPet = await Pet.findByIdAndDelete(req.params.id);

		if (!deletedPet) return res.status(404).json({ message: 'Pet not found' });

		res.status(200).json({ message: 'Pet deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete pet', error });
	}
});

export default petsRouter;
