import db from '../../../config/supabase.js';
import { createResponse } from '../../../utils/createResponse.js';

export const getExercises = async (req, res) => {
    try {
        const { data, error } = await db.from('exercise').select();

        if (error) { return createResponse(res, 400, false, 'Failed to retrieve exercises', { error: error.message }); }

        if (!data || data.length === 0) { return createResponse(res, 404, false, 'No exercises found'); }

        return createResponse(res, 200, true, 'Exercises retrieved successfully', data);

    } catch (err) { return createResponse(res, 500, false, 'Unexpected server error', { error: err.message }); }
}

export const getExerciseById = async(req, res) => {
    try {
        const { id_exercise } = req.params;

        if (!id_exercise || isNaN(id_exercise)) { return createResponse(res, 400, false, 'Invalid exercise ID'); }

        const { data, error } = await db.from('exercise').select().eq('id_exercise', id_exercise).single();

        if (error) { return createResponse(res, 400, false, 'Failed to retrieve exercise', { error: error.message }); }

        if (!data) { return createResponse(res, 404, false, `Exercise with ID ${id_exercise} not found`); }

        return createResponse(res, 200, true, 'Exercise retrieved successfully', data);

    } catch (err) { return createResponse(res, 500, false, 'Unexpected server error', { error: err.message }); }
}
