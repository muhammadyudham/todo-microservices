require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
// Kita pakai 127.0.0.1 agar lebih stabil daripada localhost
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/microservice-auth';

mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Auth Database Connected'))
    .catch(err => console.error('❌ Database Connection Error:', err));

// --- ROUTE REGISTER ---
app.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validasi Input Kosong
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Semua kolom wajib diisi!' });
        }

        // Cek User Ganda
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email sudah terdaftar!' });
        }

        // Simpan User Baru
        const newUser = new User({ username, email, password });
        await newUser.save();

        console.log(`✅ User Baru Terdaftar: ${email}`);
        res.status(201).json({ message: 'Registrasi Berhasil! Silakan Login.' });

    } catch (error) {
        console.error("❌ ERROR REGISTER (Detail):", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// --- ROUTE LOGIN ---
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Email tidak ditemukan' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Password salah!' });

        // --- PERBAIKAN DI SINI ---
        // Kita paksa pakai string 'rahasia' agar SAMA PERSIS dengan Todo Service
        const token = jwt.sign({ id: user._id }, 'rahasia', { expiresIn: '1h' });

        res.json({ message: 'Login Berhasil', token, user: { username: user.username } });

    } catch (error) {
        console.error("❌ ERROR LOGIN (Detail):", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`🛡️ Auth Service running on port ${PORT}`));