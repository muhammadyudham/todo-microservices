const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    }
});

// --- BAGIAN YANG DIPERBAIKI ---
// Hapus parameter 'next' dari dalam kurung function()
UserSchema.pre('save', async function() {
    
    // Jika password tidak berubah, langsung stop (return)
    if (!this.isModified('password')) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        // HAPUS baris next() karena di async tidak butuh
    } catch (error) {
        throw new Error(error); // Lempar error langsung
    }
});

module.exports = mongoose.model('User', UserSchema);