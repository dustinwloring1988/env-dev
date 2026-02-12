import { Router } from 'express';
import * as secretController from '../controllers/secretController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/:appId/secrets', secretController.getSecrets);
router.get('/:appId/secrets/export', secretController.getDecryptedSecrets);
router.get('/:appId/secrets/:key', secretController.getSecret);
router.post('/:appId/secrets', secretController.createSecret);
router.put('/:appId/secrets/:key', secretController.updateSecret);
router.delete('/:appId/secrets/:key', secretController.deleteSecret);

export default router;
