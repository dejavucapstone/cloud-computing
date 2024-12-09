import db from '../../../config/supabase.js';
import { createResponse } from '../../../utils/createResponse.js';

// CREATE User
export async function createUser(req, res) {
    const { gender, berat_badan, tinggi_badan, id_email } = req.body;

    try {
        const { data, error } = await db
            .from('user')
            .insert([{ gender, berat_badan, tinggi_badan, id_email }]);

        if (error) {
            console.error('Error creating user:', error);
            return createResponse(res, 500, false, 'Failed to create user', { error: error.message });
        }

        return createResponse(res, 201, true, 'User created successfully', data[0]);
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}

// READ User by ID
export async function getUser(req, res) {
    const { id } = req.params;

    try {
        const { data, error } = await db.from('user').select('*').eq('id_data', id);

        if (error || data.length === 0) {
            console.error('Error retrieving user:', error);
            return createResponse(res, 404, false, 'User not found');
        }

        return createResponse(res, 200, true, 'User retrieved successfully', data[0]);
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}

// UPDATE User
export async function updateUser(req, res) {
    const { id } = req.params;
    const { gender, berat_badan, tinggi_badan } = req.body;

    try {
        const { data, error } = await db
            .from('user')
            .update({ gender, berat_badan, tinggi_badan })
            .eq('id_data', id);

        if (error || !data.length) {
            console.error('Error updating user:', error);
            return createResponse(res, 500, false, 'Failed to update user', { error: error.message });
        }

        return createResponse(res, 200, true, 'User updated successfully', data[0]);
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}

// DELETE User
export async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        const { data, error } = await db.from('user').delete().eq('id_data', id);

        if (error || !data) {
            console.error('Error deleting user:', error);
            return createResponse(res, 500, false, 'Failed to delete user', { error: error.message });
        }

        return createResponse(res, 200, true, 'User deleted successfully');
    } catch (err) {
        console.error('Unexpected error:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}

export async function getUserById(req, res) {
    const { id } = req.params;

    try {
        const { data, error } = await db
            .from('user')
            .select('*')
            .eq('id_data', id)
            .single(); // Mengambil hanya satu record

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