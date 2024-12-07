import db from '../../../config/supabase.js';

export async function getExercises(req, res) {
    try {
        const { data, error } = await db.from('exercise').select();

        if (error) {
            console.error('Error retrieving exercises:', error); 
            return res.status(500).json({ message: 'Error retrieving exercises', error });
        }

        console.log('Exercises retrieved successfully:', data); 
        res.status(200).json(data);
    } catch (err) {
        console.error('Unexpected server error:', err); 
        res.status(500).send('Server error.');
    }
}