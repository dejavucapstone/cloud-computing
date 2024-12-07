import  db  from '../../../config/supabase.js';

export async function createUser(req, res) {
    const { email, nama_user, password, gender, berat_badan, tinggi_badan } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data: loginData, error: loginError } = await db('LOGIN').insert([
            { email, nama_user, password: hashedPassword }
        ]);
        if (loginError) return res.status(500).send('Error creating login.');

        const { data: userData, error: userError } = await db('USER').insert([
            { email, gender, berat_badan, tinggi_badan }
        ]);
        if (userError) return res.status(500).send('Error creating user.');

        res.status(201).send('User created successfully.');
    } catch (err) {
        res.status(500).send('Server error.');
    }
}

export async function getUserProfile(req, res) {
    const { id } = req.params;

    try {
        const { data, error } = await db('user').select('*').eq('id_data', id);
        if (error || data.length === 0) return res.status(404).send('User not found.');

        res.status(200).json(data[0]);
    } catch (err) {
        res.status(500).send('Server error.');
    }
}

export async function updateUserProfile(req, res) {
    const { id } = req.params;
    const { gender, berat_badan, tinggi_badan } = req.body;

    try {
        const { data, error } = await db('USER').update({ gender, berat_badan, tinggi_badan }).eq('id_data', id);
        if (error) return res.status(500).send('Error updating user profile.');

        res.status(200).send('User profile updated successfully.');
    } catch (err) {
        res.status(500).send('Server error.');
    }
}
