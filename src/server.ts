import bcrypt from 'bcrypt';
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { File } from './models/File';

const PORT = process.env.PORT || 3333;
const DATABASE_URL = process.env.DATABASE_URL || '';

const server = express();

const upload = multer({
  dest: 'uploads',
});

mongoose.connect(DATABASE_URL);

server.get('/', (req, res) => {
  return res.json({ hello: 'World' });
});

server.post('/upload', upload.single('file'), async (req, res) => {
  const { password } = req.body;

  const fileData = {
    path: req.file?.path,
    originalName: req.file?.originalname,
  };

  if (password !== null && password !== '') {
    Object.assign(fileData, {
      password: await bcrypt.hash(password, 10),
    });
  }

  const file = await File.create(fileData);

  return res.json(file.originalName);
});

server.listen(PORT, () => console.log(`💻 Server is up in port... ${PORT}`));
