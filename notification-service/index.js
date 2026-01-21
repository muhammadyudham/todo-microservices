const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3002; // Perhatikan: Portnya BEDA dengan Todo Service (3000/3001)

app.use(bodyParser.json());

// Endpoint untuk menerima notifikasi
app.post('/notify', (req, res) => {
    const { title, deadline } = req.body;
    
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