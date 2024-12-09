import crypto from 'crypto';

export const hashingPassword = (password) => {
    const hash = crypto.pbkdf2Sync(password, '', 1000, 64, 'sha512').toString('hex'); 
    return { hash };
}

export const verifyPassword = (password, storedHash) => {
    const hash = crypto.pbkdf2Sync(password, '', 1000, 64, 'sha512').toString('hex');
    return hash === storedHash;
}