# 📝 Aplikasi Todo List - Microservices Architecture

Proyek ini adalah implementasi **Microservices Architecture** menggunakan Node.js. Aplikasi ini memisahkan logika autentikasi (Auth Service), manajemen tugas (Todo Service), dan sistem notifikasi (Notification Service) menjadi tiga layanan independen yang saling berkomunikasi melalui REST API.

## 🚀 Fitur Utama

- **Microservices Architecture:** Terpisah menjadi `Auth Service`, `Todo Service`, dan `Notification Service`.
- **Autentikasi & Keamanan:** Menggunakan JWT (JSON Web Token) untuk autentikasi user.
- **Isolasi Data Per User:** Setiap user hanya bisa melihat dan mengelola todo miliknya sendiri.
- **Multi-Page Frontend:** Halaman terpisah untuk login, register, dan home (dashboard).
- **Decoupled System:** Jika fitur notifikasi mati, aplikasi utama tetap berjalan normal (Fault Tolerance).
- **RESTful API:** Komunikasi data menggunakan standar HTTP method (GET, POST, PUT, PATCH, DELETE).
- **Inter-Service Communication:** Menggunakan Axios untuk komunikasi antar server.
- **Database:** MongoDB (NoSQL) untuk penyimpanan data yang fleksibel.

## 🛠️ Teknologi yang Digunakan (Tech Stack)

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Authentication:** JWT, bcryptjs
- **Tools:** VS Code, Git, Nodemon

## 📂 Struktur Proyek

```bash
├── auth-service/               # Service A: Autentikasi User (Port 3003)
│   ├── models/                 # User Schema
│   ├── index.js                # Entry Point Auth Service
│   └── package.json
│
├── todo-service/               # Service B: Manajemen Todo & Frontend (Port 3001)
│   ├── controllers/            # Logika CRUD Todo
│   ├── middleware/             # JWT Verification
│   ├── models/                 # Todo Schema
│   ├── routes/                 # Route API
│   ├── login.html              # Halaman Login
│   ├── register.html           # Halaman Register
│   ├── home.html               # Halaman Dashboard Todo
│   ├── style.css               # Styling
│   ├── server.js               # HTTP Server
│   ├── app.js                  # Express Config
│   └── package.json
│
└── notification-service/       # Service C: Notifikasi (Port 3002)
    ├── index.js                # Entry Point Notification Service
    └── package.json
```

## 🔧 Setup & Instalasi

### 1. Prerequisites

- Node.js (v14+)
- MongoDB (running on localhost:27017)
- Git

### 2. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/proyek-microservices.git
cd proyek-microservices
```

### 3. Setup Auth Service

```bash
cd auth-service
npm install
node index.js
# Auth Service berjalan di http://localhost:3003
```

### 4. Setup Todo Service

```bash
cd ../todo-service
npm install
node server.js
# Todo Service berjalan di http://localhost:3001
```

### 5. Setup Notification Service

```bash
cd ../notification-service
npm install
node index.js
# Notification Service berjalan di http://localhost:3002
```

## 📖 Cara Penggunaan

1. **Buka Browser:** `http://localhost:3001/login.html`
2. **Register Akun Baru:** Klik "Belum punya akun? Daftar"
3. **Login:** Masukkan email dan password
4. **Kelola Todo:**
   - Tambah tugas baru dengan judul dan deadline
   - Klik tugas untuk tandai selesai
   - Hapus tugas yang tidak perlu
5. **Logout:** Klik tombol "Keluar"

## 🔒 Keamanan

- **Password Encryption:** Menggunakan bcryptjs untuk hash password
- **JWT Token:** Token dikirim di header `x-auth-token` setiap request
- **User Isolation:** Query database selalu filter dengan `userId` dari token
- **Autocomplete Off:** Input login/register tidak menyimpan credential

## 🛑 Fitur Keamanan Tambahan

- **Konfirmasi Aksi:** Dialog confirm saat toggle/delete todo
- **Session Management:** Logout akan clear localStorage dan redirect ke login
- **Error Handling:** Pesan error yang jelas untuk user

## 📊 API Endpoints

### Auth Service (Port 3003)

```
POST   /auth/register    # Register user baru
POST   /auth/login       # Login & dapatkan JWT token
```

### Todo Service (Port 3001)

```
POST   /todos            # Buat todo baru (require token)
GET    /todos            # Ambil semua todo user (require token)
GET    /todos/:todoId    # Ambil todo spesifik (require token)
PUT    /todos/:todoId    # Update todo (require token)
PATCH  /todos/:todoId    # Toggle complete status (require token)
DELETE /todos/:todoId    # Hapus todo (require token)
```

### Notification Service (Port 3002)

```
POST   /notify           # Kirim notifikasi (internal use)
```

## 🧹 Cleanup & Optimasi

- **Folder `credentials/` dihapus:** Menggunakan connection string langsung di `app.js`
- **File `index.html` dihapus:** Diganti dengan `login.html`, `register.html`, `home.html`
- **Server.js disederhanakan:** Dari 61 baris menjadi 31 baris, tetap fungsional

## 🐛 Troubleshooting

### Port sudah digunakan?

```bash
# Cari process yang pakai port
netstat -ano | findstr :3001   # Windows
lsof -i :3001                   # macOS/Linux

# Kill process
taskkill /PID <PID> /F          # Windows
kill -9 <PID>                   # macOS/Linux
```

### MongoDB tidak terkoneksi?

- Pastikan MongoDB service running
- Cek connection string di `app.js` dan `auth-service/index.js`

### Token tidak valid?

- Pastikan `JWT_SECRET` sama di auth-service dan todo-service (nilai: `'rahasia'`)
- Check jika token sudah expired (1 hour)

## 📝 Catatan Pengembangan

- Setiap service bisa dijalankan independen
- Database terpisah per service (microservice pattern)
- Data todo terisolasi per user dengan field `userId`
- Frontend minimal menggunakan Vanilla JS (no framework)

## 👤 Author

[Muhammad Yudha Maputra]

## 📄 License

MIT
