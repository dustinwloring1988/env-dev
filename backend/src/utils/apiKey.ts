import crypto from 'crypto';

export function generateApiKey(): string {
  const prefix = 'envdev_';
  const randomBytes = crypto.randomBytes(24).toString('hex');
  return prefix + randomBytes;
}
