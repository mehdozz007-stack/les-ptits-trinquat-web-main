const crypto = require('crypto');

const password = 'poiuytreza4U!';
const salt = crypto.randomBytes(16);
const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
const combined = Buffer.concat([salt, derivedKey]);
const hash = combined.toString('base64');

console.log(hash);
