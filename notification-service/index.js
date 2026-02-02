const express = require('express');

const app = express();
const PORT = process.env.PORT || 3002; // Port configurable via env

app.use(express.json());

// Endpoint untuk menerima notifikasi
app.post('/notify', (req, res) => {
    const { title, deadline } = req.body;

    if (!title) {
        return res.status(400).json({ status: 'error', message: 'Title is required' });
    }
    
    console.log("========================================");
    console.log(`[SERVICE NOTIFIKASI] Menerima Data Baru:`);
    console.log(`📧 Mengirim Email ke User...`);
    console.log(`📝 Judul Tugas : ${title}`);
    console.log(`📅 Deadline    : ${deadline || 'Tidak ada deadline'}`);
    console.log("========================================");

    res.json({ status: 'Email Sent Successfully' });
});

app.listen(PORT, () => {
    console.log(`📢 Notification Service lari di Port ${PORT}`);
});