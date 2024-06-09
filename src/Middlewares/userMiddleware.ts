import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import keyU from '../config';

function User(req: Request, res: Response, next: NextFunction): void {
    const token: string | undefined = req.headers.authorization;
    if (!token) {
        res.status(401).json({ msg: 'No token provided' });
    } else {
        const words: string[] = token.split(' ');
        const jwtToken: string = words[1];
        
        try {
            const decodeValue: any = jwt.verify(jwtToken, keyU);
            if (decodeValue.username) {
                next();
            } else {
                res.status(403).json({ msg: 'You are not authenticated' });
            }
        } catch (error) {
            res.status(403).json({ msg: 'Invalid token' });
        }
    }
}
export default User;
