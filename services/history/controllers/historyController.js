import db from "../../../config/supabase.js";
import { createResponse } from "../../../utils/createResponse.js";

export async function createHistory(req, res) {
    const { id_user, date, duration, exercises } = req.body;

    try {
        if (!id_user || !date || !duration || !exercises || !Array.isArray(exercises)) {
            return createResponse(res, 400, false, 'All fields are required and exercises must be an array.');
        }

        const { data: validExercises, error: exerciseError } = await db
            .from('exercise')
            .select('nama_exercise');

        if (exerciseError) {
            return createResponse(res, 500, false, 'Failed to validate exercises.', { error: exerciseError.message });
        }

        const validExerciseNames = new Set(validExercises.map((item) => item.nama_exercise));
        const invalidExercises = exercises.filter(
            (exercise) => !validExerciseNames.has(exercise.exercise_name)
        );
        
        if (invalidExercises.length > 0) {
            return createResponse(res, 400, false, 'Invalid exercise names provided.', {
                invalidExercises: invalidExercises.map((e) => e.exercise_name),
            });
        }
        
        const detilHistory = {
            date,
            duration,
            exercises,
        };

        const { data, error } = await db
            .from('history')
            .insert([{ id_user, detil_history: detilHistory }])
            .select();

        if (error) {
            return createResponse(res, 500, false, 'Failed to add history.', { error: error.message });
        }

        return createResponse(res, 200, true, 'History added successfully.', data);
    } catch (err) {
        console.error('Error adding history:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}

export async function getHistory(req, res) {
    const { id } = req.params;

    try {
        const { data, error } = await db.from('history').select('*');

        if (error || data.length === 0) {
            console.error('Error retrieving history:', error);
            return createResponse(res, 404, false, 'History not found');
        }

        return createResponse(res, 200, true, 'History retrieved successfully', data);
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}

export async function getHistoryById(req, res) {
    const { id } = req.params;

    try {
        const { data, error } = await db
            .from('history')
            .select('*')
            .eq('id_history', id)
            .single(); 

        if (error) {
            console.error('Error retrieving history by ID:', error);
            return createResponse(res, 404, false, 'History not found', { error: error.message });
        }

        return createResponse(res, 200, true, 'History retrieved successfully', data);
    } catch (err) {
        console.error('Unexpected server error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}

export async function updateHistory(req, res) {
    const { id } = req.params;
    const { detil_history } = req.body;

    try {
        const { data, error } = await db
            .from('history')
            .update({ detil_history })
            .eq('id_history', id)
            .select();

        if (error) {
            console.error('Error updating history:', error);
            return createResponse(res, 500, false, 'Failed to update history', { error: error.message });
        }

        if (!data || data.length === 0) {
            return createResponse(res, 404, false, 'History not found');
        }

        return createResponse(res, 200, true, 'History updated successfully', data[0]);
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}


export async function deleteHistory(req, res) {
    const { id } = req.params;

    try {
        const { data, error } = await db
            .from('history')
            .delete()
            .eq('id_history', id)
            .select();

        if (error) {
            console.error('Error deleting history:', error.message);
            return createResponse(res, 500, false, 'Failed to delete history', { error: error.message });
        }

        if (!data || data.length === 0) {
            return createResponse(res, 404, false, 'History not found');
        }

        return createResponse(res, 200, true, 'History deleted successfully', { deletedHistory: data });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}


