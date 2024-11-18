import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import dotenv from 'dotenv';
dotenv.config();
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN ?? '';
const client = jwksClient({
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
});
const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
        if (err)
            return callback(err);
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
};
export const authenticateUserMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).send('Authorization header is missing');
    jwt.verify(token, getKey, { issuer: `https://${AUTH0_DOMAIN}/`, algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            console.error(`[Server]: Error authenticating user - ${err}`);
            return res.status(401).send('Invalid token');
        }
        req.userId = decoded?.sub;
        next();
    });
};
