import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
  };
  body: any;
  params: any;
  headers: any;
}

const debug = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Auth Middleware Debug]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[Auth Middleware Error]', ...args);
    }
  }
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    debug.log('Auth header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader) {
      debug.error('No authorization header');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      debug.error('No token found in header');
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!process.env.JWT_SECRET) {
      debug.error('JWT_SECRET not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        debug.error('Token verification failed:', err.message);
        
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expired' });
        }
        
        return res.status(401).json({ message: 'Invalid token' });
      }

      req.user = {
        id: decoded.id,
        username: decoded.username
      };

      debug.log('Token verified for user:', req.user.username);
      next();
    });
  } catch (error: any) {
    debug.error('Authentication error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};