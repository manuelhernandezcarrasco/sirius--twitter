import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Constants } from '../utils';
import { UnauthorizedException } from '../utils/errors';

export const generateAccessToken = (payload: Record<string, string | boolean | number>) => {
  // Do not use this in production, the token will last 24 hours
  // For production apps, use a 15 minute token with a refresh token stored in a HttpOnly Cookie
  return jwt.sign(payload, Constants.TOKEN_SECRET, { expiresIn: '24h' });
};

export const withAuth = (req: Request, res: Response, next: () => any) => {
  // Get the token from the authorization header
  const [bearer, token] = (req.headers.authorization as string | undefined)?.split(' ') || [];

  // Verify that the Authorization header has the expected shape
  if (!bearer || !token || bearer !== 'Bearer') throw new UnauthorizedException('MISSING_TOKEN');

  // Verify that the token is valid
  jwt.verify(token, Constants.TOKEN_SECRET, (err, context) => {
    if (err) throw new UnauthorizedException('INVALID_TOKEN');
    res.locals.context = context;
    next();
  });
};

export const socketAuth = (socket: any, next: (err?: any) => any) => {

  const token  = (socket.handshake.headers?.authorization as string | undefined)?.split(' ')[1] || null;

  if (!token) return next(new Error('MISSING_TOKEN'));

  jwt.verify(token, Constants.TOKEN_SECRET, (err: any, context: any) => {
    if (err) return next(new Error('INVALID_TOKEN'));
    socket.user = context;
    return next();
  })
}

export const encryptPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const checkPassword = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
