import db  from '../../../config/supabase.js';

export async function getHistory(req, res) {
    const { id_user } = req.params;

    try {
        const { data, error } = await db('history').select('*').eq('id_user', id_user);
        if (error) return res.status(500).send('Error retrieving history.');

        res.status(200).json(data);
    } catch (err) {
        res.status(500).send('Server error.');
    }
}

export async function addHistory(req, res) {
    const { id_user, detil_history } = req.body;

    try {
        const { data, error } = await db('HISTORY').insert([{ id_user, detil_history }]);
        if (error) return res.status(500).send('Error adding history.');

        res.status(201).send('History added successfully.');
    } catch (err) {
        res.status(500).send('Server error.');
    }
}
