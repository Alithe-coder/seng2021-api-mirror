import express from 'express';
import jwt from 'jsonwebtoken';
import type { AppError } from './errorHandler';


// this middleware is to intercept requests and ensure that
// a jwt token provided responds to the correct person

export const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    // if no token
    if (!token) {
        const err: AppError = new Error("Access denied: No token provided");
        err.type = "UNAUTHORIZED";
        return next(err);
    }

    try {
        // check if token is not expired
        const secret = process.env.JWT_SECRET || 'fallback_secret_for_local_dev';
        const decoded = jwt.verify(token, secret);

        // attach decoded userId
        (req as any).user = decoded;

        // if valid, mooove on
        next();
    }
    catch (error) {
        const err: AppError = new Error("Access Denied: Invalid or expired token - please login again");
        err.type = "UNAUTHORIZED";
        return next(err);
    }
}