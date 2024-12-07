import jwt from "jsonwebtoken"
import { compare, hash } from 'bcrypt';
import { createTransport } from 'nodemailer';
import db from "../../../config/supabase.js";

const { sign } = jwt;

export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const { data, error } = await db
            .from('login') // Correctly using the db client
            .select('*')
            .eq('email', email);

        if (error || data.length === 0) {
            return res.status(404).send('User not found.');
        }

        const user = data[0];
        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).send('Invalid credentials.');
        }

        const token = sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).send('Server error.');
    }
}

export async function forgotPassword(req, res) {
    const { email } = req.body;
    const code = Math.floor(1000 + Math.random() * 9000);

    try {
        const { data, error } = await db
            .from('login') // Ensure case matches table name in db
            .select('*')
            .eq('email', email);

        if (error || data.length === 0) {
            return res.status(404).send('User not found.');
        }

        const transporter = createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT, 10), // Convert port to integer
            secure: false, // Secure can depend on port used
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Support" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is ${code}`,
        });

        res.status(200).json({ message: 'Reset code sent.', code });
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).send('Server error.');
    }
}

export async function resetPassword(req, res) {
    const { email, code, newPassword } = req.body;

    try {
        const hashedPassword = await hash(newPassword, 10);
        const { data, error } = await db
            .from('login') // Ensure case matches table name in db
            .update({ password: hashedPassword })
            .eq('email', email);

        if (error) {
            return res.status(500).send('Error updating password.');
        }

        res.status(200).send('Password updated successfully.');
    } catch (err) {
        console.error(err); // Log error for debugging
        res.status(500).send('Server error.');
    }
}
