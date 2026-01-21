# 📝 Aplikasi Todo List - Microservices Architecture

Proyek ini adalah implementasi **Microservices Architecture** menggunakan Node.js. Aplikasi ini memisahkan logika manajemen tugas (CRUD) dan sistem notifikasi menjadi dua layanan (service) yang berjalan secara independen namun saling berkomunikasi.

## 🚀 Fitur Utama

- **Microservices Architecture:** Terpisah menjadi `Todo Service` dan `Notification Service`.
- **Decoupled System:** Jika fitur notifikasi mati, fitur utama Todo List tetap berjalan normal (Fault Tolerance).
- **RESTful API:** Komunikasi data menggunakan standar HTTP method (GET, POST, PUT, DELETE).
- **Inter-Service Communication:** Menggunakan `Fetch API` untuk komunikasi antar server.
- **Database:** MongoDB (NoSQL) untuk penyimpanan data yang fleksibel.

## 🛠️ Teknologi yang Digunakan (Tech Stack)

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Tools:** VS Code, Git

## 📂 Struktur Proyek

```bash
├── todo-service/           # Service A: Menangani Database & CRUD Tugas (Port 3001)
│   ├── models/             # Skema Database
│   ├── controllers/        # Logika Bisnis
│   ├── server.js           # Entry Point Service A
│   └── index.html          # Frontend Aplikasi
│
├── notification-service/   # Service B: Menangani Log & Notifikasi (Port 3002)
│   └── index.js            # Entry Point Service B
```
