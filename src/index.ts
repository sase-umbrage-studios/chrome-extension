import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { QueryController } from './query/query.controller.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.BACKEND_PORT ?? 3000;
const staticAuthDir = resolve(__dirname, '..', 'auth-spa');
const loginSpa = resolve(__dirname, '..', 'auth-spa', 'login.html');
const logoutSpa = resolve(__dirname, '..', 'auth-spa', 'logout.html');
const getAccessTokenSpa = resolve(__dirname, '..', 'auth-spa', 'get-access-token.html');

app.use(express.static(staticAuthDir));
app.use(express.json({ limit: '20mb' }));
app.use(cors());

new QueryController(app);

app.get('/', (_, res) => {
  res.send('[Server]: Redirect successful.');
});

app.get('/auth/login', (_, res) => {
  res.sendFile(loginSpa);
});

app.get('/auth/logout', (_, res) => {
  res.sendFile(logoutSpa);
});

app.get('/auth/get-access-token', (_, res) => {
  res.sendFile(getAccessTokenSpa);
});

app.get('/api', (_, res) => {
  res.send(`[Server]: This endpoint is working as expected.`);
});

app.listen(
  port,
  () => console.log(`[Server]: App listening on port ${port}.`),
);
