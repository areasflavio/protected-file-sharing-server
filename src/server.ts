import 'dotenv/config';
import express from 'express';

const server = express();

const PORT = process.env.PORT || 3333;

server.get('/', (req, res) => {
  res.json({ hello: 'World' });
});

server.listen(PORT, () => console.log(`💻 Server is up in port... ${PORT}`));
