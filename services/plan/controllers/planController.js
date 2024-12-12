import db from "../../../config/supabase.js";
import { createResponse } from "../../../utils/createResponse.js";

export async function createPlan(req, res) {
    const { id_user, id_exercise, tanggal, repetisi } = req.body;

    try {
        if (!id_user || !id_exercise || !tanggal || !repetisi) {
            return createResponse(res, 400, false, 'All fields are required.');
        }

        const isValidDate = !isNaN(Date.parse(tanggal)) && /^\d{4}-\d{2}-\d{2}$/.test(tanggal);
        if (!isValidDate) {
            return createResponse(res, 400, false, 'Invalid date format. Expected format: YYYY-MM-DD.');
        }

        const { data: user, error: userError } = await db
            .from('user')
            .select('id_user')
            .eq('id_user', id_user)
            .single();

        if (userError || !user) {
            return createResponse(res, 404, false, 'User not found.');
        }

        const { data: exercise, error: exerciseError } = await db
            .from('exercise')
            .select('id_exercise')
            .eq('id_exercise', id_exercise)
            .single();

        if (exerciseError || !exercise) {
            return createResponse(res, 404, false, 'Exercise not found.');
        }

        const { data, error } = await db
            .from('plan')
            .insert([{ id_user, id_exercise, tanggal, repetisi }])
            .select();

        if (error) {
            return createResponse(res, 500, false, 'Failed to add plan.', { error: error.message });
        }

        return createResponse(res, 200, true, 'Plan added successfully.', data);
    } catch (err) {
        console.error('Error adding Plan:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}


export async function getPlan(req, res) {
    try {
        const { data, error } = await db.from('plan').select();

        if (error || data.length === 0) {
            console.error('Error retrieving plan:', error);
            return createResponse(res, 404, false, 'Plan not found');
        }

        return createResponse(res, 200, true, 'Plan retrieved successfully', data);
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}

export async function updatePlan(req, res) {
    const { id } = req.params;
    const { tanggal, repetisi, id_exercise } = req.body;
    
    try {
        const isValidDate = !isNaN(Date.parse(tanggal)) && /^\d{4}-\d{2}-\d{2}$/.test(tanggal);
        if (!isValidDate) {
            return createResponse(res, 400, false, `Invalid date format. Expected format: YYYY-MM-DD.`);
        }

        const { data: exercise, error: exerciseError } = await db
            .from('exercise')
            .select('id_exercise')
            .eq('id_exercise', id_exercise)
            .single();

        if (exerciseError || !exercise) {
            return createResponse(res, 404, false, 'Exercise not found.');
        }
        
        const { data, error } = await db
            .from('plan')
            .update([{tanggal, repetisi, id_exercise}])
            .eq('id_jadwal', id)
            .select()

        if (error) {
            console.error('Error updating plan:', error);
            return createResponse(res, 500, false, 'Failed to update plan', { error: error.message });
        }

        if (!data || data.length === 0) {
            return createResponse(res, 404, false, 'Plan not found');
        }

        return createResponse(res, 200, true, 'Plan updated successfully', data[0]);
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}


export async function deletePlan(req, res) {
    const { id } = req.params;

    try {
        if (!id ) {
            return res.status(400).json({ message: 'ID are required.' });
        }
        const { data, error } = await db
            .from('plan')
            .delete()
            .eq('id_jadwal', id)
            .select();

        if (error) {
            console.error('Error deleting plan:', error.message);
            return createResponse(res, 500, false, 'Failed to delete plan', { error: error.message });
        }

        if (!data || data.length === 0) {
            return createResponse(res, 404, false, 'Plan not found');
        }

        return createResponse(res, 200, true, 'Plan deleted successfully', { deletedPlan: data });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}


