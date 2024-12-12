import { Router } from 'express';
import { getUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

router.get('/', getUser); 
router.get('/:id', getUserById); 
router.put('/:id', updateUser); 
router.delete('/:id', deleteUser); 

export default router;
