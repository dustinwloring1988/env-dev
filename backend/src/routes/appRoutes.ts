import { Router } from 'express';
import * as appController from '../controllers/appController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', appController.getApps);
router.post('/', appController.createApp);
router.get('/:id', appController.getApp);
router.put('/:id', appController.updateApp);
router.delete('/:id', appController.deleteApp);
router.post('/:id/regenerate-key', appController.regenerateApiKey);
router.put('/:id/require-auth', appController.toggleRequireAuth);

export default router;
