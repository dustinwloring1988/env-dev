import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createAppSchema, updateAppSchema, CreateAppInput, UpdateAppInput } from '../utils/validation';
import { generateApiKey } from '../utils/apiKey';
import { asyncHandler } from '../middleware/error';

const prisma = new PrismaClient();

export const getApps = asyncHandler(async (req: Request, res: Response) => {
  const apps = await prisma.app.findMany({
    where: { userId: req.user!.userId },
    select: {
      id: true,
      name: true,
      description: true,
      apiKey: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { secrets: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  
  res.json({ apps });
});

export const getApp = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const app = await prisma.app.findFirst({
    where: { id, userId: req.user!.userId },
    select: {
      id: true,
      name: true,
      description: true,
      apiKey: true,
      createdAt: true,
      updatedAt: true,
      secrets: {
        select: {
          id: true,
          key: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { key: 'asc' },
      },
    },
  });
  
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  res.json({ app });
});

export const createApp = asyncHandler(async (req: Request, res: Response) => {
  const data: CreateAppInput = createAppSchema.parse(req.body);
  
  const app = await prisma.app.create({
    data: {
      name: data.name,
      description: data.description,
      apiKey: generateApiKey(),
      userId: req.user!.userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      apiKey: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  
  res.status(201).json({ app });
});

export const updateApp = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: UpdateAppInput = updateAppSchema.parse(req.body);
  
  const app = await prisma.app.findFirst({
    where: { id, userId: req.user!.userId },
  });
  
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  const updated = await prisma.app.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
    select: {
      id: true,
      name: true,
      description: true,
      apiKey: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  
  res.json({ app: updated });
});

export const deleteApp = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const app = await prisma.app.findFirst({
    where: { id, userId: req.user!.userId },
  });
  
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  await prisma.app.delete({ where: { id } });
  
  res.json({ message: 'App deleted successfully' });
});

export const regenerateApiKey = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const app = await prisma.app.findFirst({
    where: { id, userId: req.user!.userId },
  });
  
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  const updated = await prisma.app.update({
    where: { id },
    data: { apiKey: generateApiKey() },
    select: {
      id: true,
      name: true,
      apiKey: true,
    },
  });
  
  res.json({ app: updated });
});
