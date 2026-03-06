import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: { userId: string; role: 'USER' | 'ADMIN' };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = verifyAccessToken(auth.slice(7));
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireRole = (role: 'ADMIN' | 'USER') => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || (role === 'ADMIN' && req.user.role !== 'ADMIN')) return res.status(403).json({ message: 'Forbidden' });
  next();
};
