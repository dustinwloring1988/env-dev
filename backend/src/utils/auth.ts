import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface TokenPayload {
  userId: string;
  type: 'access' | 'refresh';
}

export function generateAccessToken(userId: string): string {
  return jwt.sign(
    { userId, type: 'access' },
    config.jwt.secret,
    { expiresIn: '15m' }
  );
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    { userId, type: 'refresh' },
    config.jwt.secret,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
  
  if (decoded.type !== 'access') {
    throw new Error('Invalid token type');
  }
  
  return decoded;
}

export function verifyRefreshToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
  
  if (decoded.type !== 'refresh') {
    throw new Error('Invalid token type');
  }
  
  return decoded;
}
