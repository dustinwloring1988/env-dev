import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createSecretSchema, updateSecretSchema, CreateSecretInput, UpdateSecretInput } from '../utils/validation';
import { encrypt, decrypt } from '../utils/encryption';
import { asyncHandler } from '../middleware/error';

const prisma = new PrismaClient();

export const getSecrets = asyncHandler(async (req: Request, res: Response) => {
  const { appId } = req.params;
  
  const app = await prisma.app.findFirst({
    where: { id: appId, userId: req.user!.userId },
  });
  
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  const secrets = await prisma.secret.findMany({
    where: { appId },
    select: {
      id: true,
      key: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { key: 'asc' },
  });
  
  res.json({ secrets });
});

export const getSecret = asyncHandler(async (req: Request, res: Response) => {
  const { appId, key } = req.params;
  
  const app = await prisma.app.findFirst({
    where: { id: appId, userId: req.user!.userId },
  });
  
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  const secret = await prisma.secret.findUnique({
    where: {
      appId_key: {
        appId,
        key,
      },
    },
  });
  
  if (!secret) {
    return res.status(404).json({ error: 'Secret not found' });
  }
  
  const decryptedValue = decrypt(secret.value);
  
  res.json({
    secret: {
      id: secret.id,
      key: secret.key,
      value: decryptedValue,
      createdAt: secret.createdAt,
      updatedAt: secret.updatedAt,
    },
  });
});

export const createSecret = asyncHandler(async (req: Request, res: Response) => {
  const { appId } = req.params;
  const data: CreateSecretInput = createSecretSchema.parse(req.body);
  
  const app = await prisma.app.findFirst({
    where: { id: appId, userId: req.user!.userId },
  });
  
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  const existingSecret = await prisma.secret.findUnique({
    where: {
      appId_key: {
        appId,
        key: data.key,
      },
    },
  });
  
  if (existingSecret) {
    return res.status(409).json({ error: 'Secret with this key already exists' });
  }
  
  const encryptedValue = encrypt(data.value);
  
  const secret = await prisma.secret.create({
    data: {
      key: data.key,
      value: encryptedValue,
      appId,
    },
    select: {
      id: true,
      key: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  
  res.status(201).json({ secret });
});

export const updateSecret = asyncHandler(async (req: Request, res: Response) => {
  const { appId, key: currentKey } = req.params;
  const data: UpdateSecretInput = updateSecretSchema.parse(req.body);
  
  const app = await prisma.app.findFirst({
    where: { id: appId, userId: req.user!.userId },
  });
  
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  const secret = await prisma.secret.findUnique({
    where: {
      appId_key: {
        appId,
        key: currentKey,
      },
    },
  });
  
  if (!secret) {
    return res.status(404).json({ error: 'Secret not found' });
  }
  
  const newKey = data.key || currentKey;
  const newValue = data.value || '';
  
  if (newKey !== currentKey) {
    const existingSecret = await prisma.secret.findUnique({
      where: {
        appId_key: {
          appId,
          key: newKey,
        },
      },
    });
    
    if (existingSecret) {
      return res.status(409).json({ error: 'Secret with this key already exists' });
    }
  }
  
  const encryptedValue = encrypt(newValue);
  
  const updated = await prisma.secret.update({
    where: {
      appId_key: {
        appId,
        key: currentKey,
      },
    },
    data: {
      key: newKey,
      value: encryptedValue,
    },
    select: {
      id: true,
      key: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  
  res.json({ secret: updated });
});

export const deleteSecret = asyncHandler(async (req: Request, res: Response) => {
  const { appId, key } = req.params;
  
  const app = await prisma.app.findFirst({
    where: { id: appId, userId: req.user!.userId },
  });
  
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  const secret = await prisma.secret.findUnique({
    where: {
      appId_key: {
        appId,
        key,
      },
    },
  });
  
  if (!secret) {
    return res.status(404).json({ error: 'Secret not found' });
  }
  
  await prisma.secret.delete({
    where: {
      appId_key: {
        appId,
        key,
      },
    },
  });
  
  res.json({ message: 'Secret deleted successfully' });
});

export const getDecryptedSecrets = asyncHandler(async (req: Request, res: Response) => {
  const { appId } = req.params;
  
  const app = await prisma.app.findFirst({
    where: { id: appId, userId: req.user!.userId },
  });
  
  if (!app) {
    return res.status(404).json({ error: 'App not found' });
  }
  
  const secrets = await prisma.secret.findMany({
    where: { appId },
    select: {
      id: true,
      key: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { key: 'asc' },
  });
  
  const decryptedSecrets = secrets.map(secret => {
    const fullSecret = secret as typeof secret & { value: string };
    return {
      id: secret.id,
      key: secret.key,
      value: '', 
      createdAt: secret.createdAt,
      updatedAt: secret.updatedAt,
    };
  });
  
  res.json({ secrets: decryptedSecrets });
});
