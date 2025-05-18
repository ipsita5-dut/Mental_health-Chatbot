import { NextFunction, Request,Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { COOKIE_NAME } from './constants';
import { resolve } from 'path';

export const createToken = (id: string, email: string, expiresIn: string) => {
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn});
    return token;
}


export const verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.signedCookies[COOKIE_NAME];
    if (!token || token.trim() === "") {
        res.status(401).json({ message: "Token not received" });
        return;
    }

    return new Promise<void>((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET!, (err: jwt.VerifyErrors | null, decoded: jwt.JwtPayload | string | undefined) => {
            if (err) {
                console.error("Token verification failed:", err.message);
                res.status(401).json({ message: "Token Expired" });
                reject(err.message);
                return;
            }

            console.log("Token verification successful");
            res.locals.jwtData = decoded; // Attach decoded token to res.locals
            return next();  // Proceed to the next middleware
        });
    });
};
