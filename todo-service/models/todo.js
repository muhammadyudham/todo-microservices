const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    // --- TAMBAHAN WAJIB (AGAR DATA TERPISAH) ---
    userId: { 
        type: String, 
        required: true // Wajib ada, biar tidak ada tugas tanpa tuan
    },
    // -------------------------------------------

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        default: 'N/A'
    },
    deadline: {
        type: Date,    
        default: null 
    },
    onDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    cardColor: {
        type: String,
        required: true,
        default: '#cddc39'
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false
    },
    timestamps: {
        createdOn: {
            type: Date,
            required: true,
            default: Date.now
        },
        modifiedOn: {
            type: Date,
            required: true,
            default: Date.now
        },
        completedOn: {
            type: Date,
            default: null
        }
    }
});

module.exports = mongoose.model("Todo", todoSchema);