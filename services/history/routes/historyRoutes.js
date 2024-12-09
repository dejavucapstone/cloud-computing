import { Router } from 'express';
import { createHistory, getHistory, getHistoryById, updateHistory, deleteHistory } from '../controllers/historyController.js';

const router = Router();

router.post('/', createHistory);
router.get('/', getHistory);
router.get('/:id', getHistoryById); 
router.put('/:id', updateHistory);
router.delete('/:id', deleteHistory);

export default router;
