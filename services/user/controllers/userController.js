import db from '../../../config/supabase.js';
import { createResponse } from '../../../utils/createResponse.js';

export async function getUser(req, res) {

    try {
        const { data, error } = await db.from('user').select();
        
        if (error || data.length === 0) {
            console.error('Error retrieving user:', error);
            return createResponse(res, 404, false, 'User not found');
        }

        return createResponse(res, 200, true, 'User retrieved successfully', data);
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}

export async function getUserById(req, res) {
    const { id } = req.params;

    try {
        if (!id ) {
            return res.status(400).json({ message: "ID are required." });
        }
        const { data, error } = await db
            .from('user')
            .select()
            .eq('id_user', id)
            .single();

        if (error) {
            console.error('Error retrieving user by ID:', error);
            return createResponse(res, 404, false, 'User not found', { error: error.message });
        }

        return createResponse(res, 200, true, 'User retrieved successfully', data);
    } catch (err) {
        console.error('Unexpected server error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}

export async function updateUser(req, res) {
    const { id } = req.params;
    const { gender, berat_badan, tinggi_badan, name } = req.body;

    try {
        const { data: currentUser, error: fetchError } = await db
            .from('user')
            .select('name')
            .eq('id_user', id)
            .single();

        if (fetchError || !currentUser) {
            return createResponse(res, 404, false, 'User not found.');
        }

        if (name && name !== currentUser.name) {
            const { data: existingUser } = await db
                .from('user')
                .select('id_user')
                .eq('name', name)
                .single();

            if (existingUser) {
                return createResponse(res, 400, false, 'Username is already taken.');
            }
        }

        if (gender && gender !== 'L' && gender !== 'P') {
            return createResponse(res, 400, false, 'Gender must be "L" or "P".');
        }
        
        const { data, error } = await db
            .from('user')
            .update({ gender, berat_badan, tinggi_badan, name })
            .eq('id_user', id)
            .select();

        if (error) {
            console.error('Error updating user:', error);
            return createResponse(res, 500, false, 'Failed to update user', { error: error.message });
        }

        if (!data || data.length === 0) {
            return createResponse(res, 404, false, 'User not found.');
        }

        return createResponse(res, 200, true, 'User updated successfully.', data[0]);
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error.', { error: err.message });
    }
}


export async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        if (!id ) {
            return res.status(400).json({ message: 'ID are required.' });
        }
        const { data, error } = await db
        .from('user')
        .delete()
        .eq('id_user', id)
        .select();

        if (error) {
            console.error('Error updating user:', error);
            return createResponse(res, 500, false, 'Failed to delete user', { error: error.message });
        }

        if (!data || data.length === 0) {
            return createResponse(res, 404, false, 'User not found.');
        }


        return createResponse(res, 200, true, 'User deleted successfully');
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}
