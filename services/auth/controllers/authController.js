import jwt from 'jsonwebtoken';
import { emailSender } from '../../../utils/emailSender.js';
import { createResponse } from '../../../utils/createResponse.js'
import db from '../../../config/supabase.js';
import { hashingPassword } from '../../../utils/hashPassword.js';
import { verifyPassword }  from '../../../utils/hashPassword.js';

const verificationCodes = {}; 

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        if (!email || !password ) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const { data: user, error } = await db
            .from('login')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return createResponse(res, 401, false, 'The credentials you provided are incorrect.');
        }

        const { password: storedHash } = user;

        const isPasswordValid = verifyPassword(password, storedHash);
        if (!isPasswordValid) {
            return createResponse(res, 401, false, 'Invalid email or password.');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return createResponse(res, 200, true, 'Login successful', { token });
    } catch (err) {
        console.error('Error during login:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}

export async function register(req, res) {
    const { name, phone_number, password, email, gender, berat_badan, tinggi_badan } = req.body;

    try {
        if (!email || !phone_number || !password || !name || !gender || !berat_badan || !tinggi_badan) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return createResponse(res, 400, false, 'Invalid email format.');
        }
        
        if (gender !== 'L' && gender !== 'P') {
            return res.status(400).json({ message: 'Gender must be "L" or "P".' });
        }

        const { data: existingLoginUser } = await db
            .from('login')
            .select('*')
            .eq('email', email)
            .single();

        if (existingLoginUser) {
            return createResponse(res, 400, false, 'Email is already taken.');
        }

        const { data: existingUser } = await db
            .from('user')
            .select('*')
            .eq('name', name)
            .single();

        if (existingUser) {
            return createResponse(res, 400, false, 'Username is already registered.');
        }

        const { hash } = hashingPassword(password);

        const { data: userData, error: userError } = await db
            .from('user')
            .insert([{email: email, gender: gender, berat_badan: berat_badan, tinggi_badan: tinggi_badan, name: name, phone_number: phone_number }])
            .select();

        if (userError) {
            throw userError;
        }
        
        const { data: loginData, error: loginError } = await db
            .from('login')
            .insert([{ email: email, password: hash }])
            .select();
        
        if (loginError) {
            await db.from('user').delete().eq('id_data', userData[0].id_data);
            throw loginError;
        }

        return createResponse(res, 200, true, 'Register successful', {loginData, userData});

    } catch (err) {
        console.error(err);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}

export async function forgotPassword(req, res) {
    const { email } = req.body;

    try {
        if (!email ) {
            return res.status(400).json({ message: 'Email fields are required.' });
        }
        const { data: user, error: userError } = await db
            .from('user')
            .select('*')
            .eq('email', email)
            .single();

        if (userError || !user) {
            return createResponse(res, 404, false, 'User not found');
        }
        const verificationCode = Math.floor(1000 + Math.random() * 9000);
        verificationCodes[email] = verificationCode;
        const expiresAt = new Date(Date.now() + 10   * 60 * 1000).toISOString(); // 5 menit

        const { error: updateError } = await db
            .from('login')
            .update({ reset_code: verificationCode, reset_code_expired: expiresAt })
            .eq('email', email)
            
        if (updateError) {
            console.error('Error during forgot password:', err.message);
            return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
        }

        await emailSender(email, 'Password Reset Verification Code', `Your verification code is: ${verificationCode}\nYour verification code will expire in 10 minutes.`);
        return createResponse(res, 200, true, 'Verification code sent to your email');
    } catch (err) {
        console.error('Error during forgot password:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}

export async function resetPassword(req, res) {
    const { email, resetCode, newPassword } = req.body;

    try {
        if (!email || !resetCode || !newPassword ) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const { data, error } = await db
            .from('login')
            .select('reset_code, reset_code_expired')
            .eq('email', email)
            .single();

        if (error || !data) {
            return createResponse(res, 404, false, 'Email not found or invalid');
        }

        const { reset_code, reset_code_expired } = data;

        if (reset_code !== resetCode) {
            return createResponse(res, 400, false, 'Invalid verification code');
        }

        if (new Date(reset_code_expired) < new Date()) {
            return createResponse(res, 400, false, 'Verification code has expired');
        }

        const { hash: hashedPassword } = hashingPassword(newPassword);

        const { error: updateError } = await db
        .from('login')
        .update({ password: hashedPassword, reset_code: null, reset_code_expired: null })
        .eq('email', email);

        if (updateError) {
            return createResponse(res, 500, false, 'Failed to reset password', { error: updateError.message });
        }
        return createResponse(res, 200, true, 'Password reset successful');
    } catch (err) {
        console.error('Error during password reset:', err.message);
        return createResponse(res, 500, false, 'Unexpected server error', { error: err.message });
    }
}
