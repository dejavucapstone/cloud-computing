import { Router } from 'express';
import { getExercises, getExerciseById  } from '../controllers/exerciseController.js';
const router = Router();

router.get('/', getExercises); 
router.get('/:id_exercise', getExerciseById);


export default router;
