import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { registerSchema, loginSchema, RegisterInput, LoginInput } from '../utils/validation';
import { generateAccessToken, generateRefreshToken } from '../utils/auth';
import { asyncHandler } from '../middleware/error';

const prisma = new PrismaClient();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data: RegisterInput = registerSchema.parse(req.body);
  
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  
  const passwordHash = await bcrypt.hash(data.password, 12);
  
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: passwordHash,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
  
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  
  res.status(201).json({
    user,
    accessToken,
    refreshToken,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data: LoginInput = loginSchema.parse(req.body);
  
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const isValidPassword = await bcrypt.compare(data.password, user.password);
  
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }
  
  const { userId } = await import('../utils/auth').then(m => m.verifyRefreshToken(refreshToken));
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  const newAccessToken = generateAccessToken(user.id);
  
  res.json({ accessToken: newAccessToken });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ user });
});
