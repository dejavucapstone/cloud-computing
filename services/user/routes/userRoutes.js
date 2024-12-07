import { Router } from 'express';
import { createUser, getUserProfile, updateUserProfile } from '../controllers/userController.js';
const router = Router();

router.post('/', createUser); 
router.get('/:id', getUserProfile); 
router.put('/:id', updateUserProfile); 

export default router;
