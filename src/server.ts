import 'dotenv/config';
import express, { Request, Response } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { File } from './models/File';

const PORT = process.env.PORT || 3333;
const DATABASE_URL = process.env.DATABASE_URL || '';
const APP_URL = process.env.APP_URL || '';

const server = express();
server.use(express.urlencoded({ extended: true }));

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const ext = file.originalname.split('.')[1];
    cb(null, `${name}_${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
});

mongoose.connect(DATABASE_URL);

server.get('/', (req, res) => {
  return res.json({ hello: 'World' });
});

server.post('/upload', upload.single('file'), async (req, res) => {
  const { password } = req.body;

  if (!req.file) return;

  const fileData = {
    path: req.file?.path,
    originalName: req.file?.originalname,
  };

  if (password && password.trim() !== '') {
    const hashPassword = await bcrypt.hash(password, 10);

    Object.assign(fileData, {
      password: hashPassword,
    });
  }

  const file = await File.create(fileData);

  return res.json({ fileLink: `${APP_URL}/file/${file.id}` });
});

server.route('/file/:id').get(handleDownload).post(handleDownload);

async function handleDownload(req: Request, res: Response) {
  const { password } = req.body;

  const file = await File.findById(req.params.id);

  if (!file) {
    return res.status(400).json({ error: 'File not found' });
  }

  if (file.password && !password) {
    return res.status(400).json({ error: 'No password was provided.' });
  }

  if (file.password && !(await bcrypt.compare(password, file.password))) {
    return res.status(400).json({ error: 'Wrong password.' });
  }

  file.downloadCounter++;
  await file.save();

  return res.download(file.path, file.originalName);
}

server.listen(PORT, () => console.log(`💻 Server is up in port... ${PORT}`));
