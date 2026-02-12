import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getUsers, getUser, updateUserRole, deleteUser } from '../controllers/userController';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id/role', updateUserRole);
router.delete('/:id', deleteUser);

export default router;
