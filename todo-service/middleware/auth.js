// todo-service/middleware/auth.js
const jwt = require('jsonwebtoken');

// KUNCI RAHASIA (Harus SAMA PERSIS dengan di Auth Service)
// Idealnya ditaruh di .env, tapi untuk sekarang kita samakan manual
const JWT_SECRET = 'rahasia';

module.exports = (req, res, next) => {
    // 1. Ambil token dari Header pengirim
    const token = req.header('x-auth-token');

    // 2. Kalau tidak ada token, tolak!
    if (!token) {
        return res.status(401).json({ message: 'Akses Ditolak! Tidak ada token.' });
    }

    try {
        // 3. Cek keaslian token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 4. Kalau asli, simpan data user ke request agar bisa dipakai nanti
        req.user = decoded;
        next(); // Lanjut boleh masuk
    } catch (error) {
        res.status(400).json({ message: 'Token tidak valid!' });
    }
};