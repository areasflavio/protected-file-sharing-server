import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

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

server.get('/upload', upload.single('file'), (req, res) => {
  return res.json({ upload: 'File' });
});

server.listen(PORT, () => console.log(`💻 Server is up in port... ${PORT}`));
