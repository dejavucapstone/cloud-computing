import { Router } from 'express';
import { createPlan, deletePlan, getPlan, updatePlan } from '../controllers/planController.js';

const router = Router();

router.post('/', createPlan);
router.get('/', getPlan);
router.put('/:id', updatePlan); 
router.delete('/:id', deletePlan);

export default router;
