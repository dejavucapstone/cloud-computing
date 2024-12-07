import { Router } from 'express';
import { getHistory, addHistory } from '../controllers/historyController.js';
const router = Router();

router.get('/:id_user', getHistory); 
router.post('/', addHistory); 

export default router;
