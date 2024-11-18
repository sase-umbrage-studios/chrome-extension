import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { QueryController } from './query/query.controller.js';
import { UserController } from './user/user.controller.js';
import { PaymentController } from './payment/payment.controller.js';
import { authenticateUserMiddleware } from './middleware/authenticate-user.middleware.js';
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = process.env.BACKEND_PORT ?? 3000;
const staticAuthDir = resolve(__dirname, '..', 'auth-spa');
const loginSpa = resolve(__dirname, '..', 'auth-spa', 'login.html');
const logoutSpa = resolve(__dirname, '..', 'auth-spa', 'logout.html');
const getAccessTokenSpa = resolve(__dirname, '..', 'auth-spa', 'get-access-token.html');
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
app.use(express.static(staticAuthDir));
app.use(express.json({ limit: '20mb' }));
app.use(cors());
// Database connection
mongoose.connect(`mongodb+srv://${dbUsername}:${dbPassword}@chrome-extension.w0mag.mongodb.net/`)
    .then(() => console.log(`[Server]: Successfully connected to database`))
    .catch((error) => console.error(`[Server]: Error connecting to database - ${error}`));
// Controllers
new QueryController(app, authenticateUserMiddleware);
new UserController(app, authenticateUserMiddleware);
new PaymentController(app, authenticateUserMiddleware);
// Redirect
app.get('/', (_, res) => {
    res.send('[Server]: Redirect successful.');
});
app.get('/stripe-proof', (_, res) => {
    res.send('SASE CHROME EXTENSION');
});
// Authentification / Login
app.get('/auth/login', (_, res) => {
    res.sendFile(loginSpa);
});
app.get('/auth/logout', (_, res) => {
    res.sendFile(logoutSpa);
});
app.get('/auth/get-access-token', (_, res) => {
    res.sendFile(getAccessTokenSpa);
});
app.listen(port, () => console.log(`[Server]: App listening on port ${port}.`));
