import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT ?? 3000;

app.use(express.json({ limit: '20mb' }));
app.use(cors());

app.get('/api', (_, res) => {
  res.send(`[Server]: This endpoint is working as expected.`);
});

app.listen(
  port,
  () => console.log(`[Server]: App listening on port ${port}.`),
);