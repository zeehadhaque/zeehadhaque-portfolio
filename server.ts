import express from 'express';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { initDb } from './src/db';

const app = express();

app.use(express.static('dist', {
  index: false
}));

app.get('*', async (req, res) => {
  try {
    const template = readFileSync(resolve('dist/index.html'), 'utf-8');
    res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
  } catch (e: any) {
    res.status(500).end(e.message);
  }
});

initDb().catch(console.error);

const portStr = process.env.PORT || '3000';
const portNum = parseInt(portStr, 10);

app.listen(portNum, () => {
  console.log(`Server running at http://localhost:${portNum}`);
});
