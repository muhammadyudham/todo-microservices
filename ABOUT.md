# 📝 Tentang Proyek Todo List Teavou - Microservices Architecture

## 🎯 Deskripsi Proyek

**Todo List Teavou** adalah sebuah aplikasi manajemen tugas yang dibangun menggunakan **Microservices Architecture** dengan Node.js dan MongoDB. Proyek ini dikembangkan sebagai bagian dari pembelajaran **Semester 7 - Mata Kuliah Proyek Microservices** untuk mendemonstrasikan prinsip-prinsip arsitektur microservices modern, keamanan aplikasi web, dan best practices dalam pengembangan software.

### 🎓 Tujuan Pembelajaran

Proyek ini memiliki tujuan untuk:

1. Memahami konsep **Microservices Architecture** dan implementasinya
2. Mengimplementasikan **Authentication & Authorization** dengan JWT
3. Belajar **Database Design** untuk sistem multi-user
4. Praktik **RESTful API** development
5. Memahami **Inter-Service Communication**
6. Belajar **Security Best Practices** dalam web development
7. Menguasai **Git & GitHub Workflow**
8. Praktik **Code Organization & Documentation**

---

## 🏗️ Arsitektur Sistem

Aplikasi ini menggunakan **Three-Tier Microservices Pattern** dengan tiga layanan independen:

```
┌─────────────────────────────────────────────────────────┐
│                     USER/CLIENT                          │
│                   (Browser - Frontend)                   │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┬──────────────┐
        │                     │              │
        ▼                     ▼              ▼
   ┌─────────────┐      ┌──────────────┐  ┌──────────────┐
   │   LOGIN     │      │   TODO LIST  │  │    ABOUT     │
   │ REGISTER    │      │   DASHBOARD  │  │    PAGE      │
   └──────┬──────┘      └──────┬───────┘  └──────────────┘
          │                    │
          │ HTTP REQUEST       │ HTTP REQUEST
          │ (Credentials)      │ (JWT Token)
          ▼                    ▼
   ┌──────────────────┐  ┌────────────────┐
   │  Auth Service    │  │  Todo Service  │
   │   (Port 3003)    │  │  (Port 3001)   │
   ├──────────────────┤  ├────────────────┤
   │ - Register User  │  │ - CRUD Todo    │
   │ - Login User     │  │ - Verify JWT   │
   │ - JWT Token Gen  │  │ - Serve HTML   │
   └────────┬─────────┘  └────────┬───────┘
            │                     │
            └─────────┬───────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
        ▼                            ▼
   ┌─────────────────────┐   ┌────────────────────┐
   │  MongoDB Database   │   │ Notification Service│
   │  (Port 27017)       │   │    (Port 3002)     │
   │                     │   │                    │
   │ - Users Collection  │   │ - Log Events       │
   │ - Todos Collection  │   │ - Send Alerts      │
   └─────────────────────┘   └────────────────────┘
```

### 🔧 Komponen Sistem

#### 1. **Auth Service** (Port 3003)

```javascript
Endpoints:
  POST /auth/register     // Register user baru
  POST /auth/login        // Login & dapatkan JWT token

Database:
  - users (username, email, password_hash)

Tanggung Jawab:
  - Validasi user credentials
  - Hash & simpan password
  - Generate JWT token (expired: 1 hour)
  - Validasi email uniqueness
```

#### 2. **Todo Service** (Port 3001)

```javascript
Endpoints (Require JWT Token):
  GET    /todos           // Ambil semua todo user
  POST   /todos           // Buat todo baru
  GET    /todos/:id       // Ambil todo spesifik
  PUT    /todos/:id       // Update todo
  PATCH  /todos/:id       // Toggle complete status
  DELETE /todos/:id       // Hapus todo

Database:
  - todos (title, description, deadline, userId, isCompleted, cardColor)

Static Files:
  - login.html            // Halaman login
  - register.html         // Halaman register
  - home.html             // Dashboard todo
  - style.css             // Styling

Tanggung Jawab:
  - Verify JWT token
  - Isolasi data per userId
  - CRUD operations todo
  - Komunikasi dengan notification service
  - Serve frontend static files
```

#### 3. **Notification Service** (Port 3002)

```javascript
Endpoints:
  POST /notify            // Terima notifikasi dari todo service

Tanggung Jawab:
  - Log setiap event
  - Kirim alert/email (future feature)
  - Optional service (non-blocking)
```

---

## 🔒 Fitur Keamanan

### 1. **Authentication**

- ✅ Password hashing dengan **bcryptjs**
- ✅ JWT token untuk session management
- ✅ Token expiration (1 hour)
- ✅ Secure header transmission (`x-auth-token`)

### 2. **Authorization**

- ✅ JWT verification di setiap protected endpoint
- ✅ User isolation dengan `userId` filter
- ✅ Database query hanya mengembalikan data user yang login

### 3. **Data Protection**

- ✅ Input validation & sanitization
- ✅ CORS protection
- ✅ HTTP status code yang proper
- ✅ Error message yang informatif tapi aman

### 4. **Frontend Security**

- ✅ `autocomplete="off"` pada input sensitif
- ✅ localStorage hanya menyimpan token (bukan password)
- ✅ Redirect ke login jika token tidak ada
- ✅ Logout clear semua stored data

### 5. **API Security**

- ✅ Validation di request body
- ✅ Rate limiting consideration
- ✅ Database connection dengan auth

---

## 📚 Pembelajaran & Konsep yang Diimplementasikan

### Microservices Concepts

```
✅ Service Independence     - Setiap service bisa deploy independently
✅ Decoupling             - Komunikasi via REST API, bukan shared database
✅ Scalability            - Setiap service bisa scale sesuai kebutuhan
✅ Fault Tolerance        - Jika notification service mati, app tetap jalan
✅ Technology Diversity   - Setiap service bisa pakai tech berbeda
```

### Design Patterns

```
✅ MVC Pattern            - Models, Controllers, Routes terpisah
✅ Middleware Pattern     - Auth middleware untuk protected routes
✅ Error Handling         - Try-catch, error response codes
✅ Request-Response       - Standard HTTP communication
```

### Database Design

```
✅ Schema Normalization   - Fields yang tepat dengan type data
✅ Referential Integrity  - userId sebagai foreign key
✅ Indexing              - userId indexed untuk query performance
✅ Data Isolation        - Per-user data separation
```

### Security Best Practices

```
✅ Password Hashing       - Bcryptjs dengan salt rounds
✅ Token-Based Auth      - JWT dengan expiration
✅ Input Validation      - Check email format, required fields
✅ HTTPS Ready           - Secure by design (use HTTPS in production)
✅ CORS Configuration    - Proper CORS setup untuk API
```

---

## 📊 Data Flow

### Flow 1: User Registration

```
1. User input email, username, password di register.html
2. Frontend POST /auth/register (auth-service:3003)
3. Auth Service:
   - Validate input (email format, unique)
   - Hash password dengan bcryptjs
   - Simpan user ke MongoDB
   - Return success message
4. Frontend: Alert "Registrasi Berhasil" → Redirect ke login
5. User bisa login
```

### Flow 2: User Login

```
1. User input email, password di login.html
2. Frontend POST /auth/login (auth-service:3003)
3. Auth Service:
   - Cari user by email
   - Verify password dengan bcryptjs
   - Generate JWT token (HS256, 1 hour expire)
   - Return token + username
4. Frontend:
   - localStorage.setItem('token', token)
   - localStorage.setItem('username', username)
   - Redirect ke home.html
5. App ready untuk CRUD todo
```

### Flow 3: Create Todo

```
1. User isi title, description, deadline, color di home.html
2. Frontend POST /todos (todo-service:3001)
   - Header: x-auth-token: <JWT_TOKEN>
   - Body: { title, description, deadline, cardColor }
3. Todo Service:
   - Middleware: Verify JWT token → Extract userId
   - Controller: Create todo dengan userId dari token
   - Axios: POST /notify (notification-service:3002)
   - Return created todo
4. Notification Service: Log event
5. Frontend: Fetch ulang todos & display
```

### Flow 4: Get All Todos

```
1. User buka home.html
2. Frontend GET /todos (todo-service:3001)
   - Header: x-auth-token: <JWT_TOKEN>
3. Todo Service:
   - Middleware: Verify JWT → Extract userId
   - Controller: Query.find({ userId: <userId> })
   - Return todos hanya user yang login
4. Frontend: Render todos ke DOM
```

---

## 🚀 Cara Menjalankan Proyek

### Prerequisites

```bash
- Node.js v14+
- MongoDB (running on localhost:27017)
- Git
- npm atau yarn
```

### Setup & Run

```bash
# 1. Clone repository
git clone https://github.com/muhammadyudham/todo-microservices.git
cd todo-microservices

# 2. Setup & run Auth Service
cd auth-service
npm install
node index.js
# Output: 🛡️ Auth Service running on port 3003

# 3. Setup & run Todo Service (new terminal)
cd todo-service
npm install
node server.js
# Output: ✅ Todo Api running on port 3001

# 4. Setup & run Notification Service (new terminal)
cd notification-service
npm install
node index.js
# Output: 📧 Notification Service running on port 3002

# 5. Open browser
http://localhost:3001/login.html
```

---

## 🧪 Testing dengan Postman

### Test Register

```
POST http://localhost:3003/auth/register
Body (JSON):
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "message": "Registrasi Berhasil! Silakan Login."
}
```

### Test Login

```
POST http://localhost:3003/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "message": "Login Berhasil",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "username": "testuser" }
}
```

### Test Create Todo

```
POST http://localhost:3001/todos
Headers:
  Content-Type: application/json
  x-auth-token: <JWT_TOKEN_FROM_LOGIN>

Body (JSON):
{
  "title": "Belajar Microservices",
  "description": "Finish homework",
  "deadline": "2026-02-15",
  "cardColor": "#4CAF50"
}

Response: 201 Created
{
  "status": "Success",
  "message": "Todo Created SuccessFully!",
  "todo": { _id, userId, title, ... }
}
```

---

## 📝 Struktur File Project

```
proyek-microservices/
│
├── auth-service/
│   ├── models/
│   │   └── User.js           # User schema
│   ├── index.js              # Entry point
│   ├── package.json
│   └── .env                  # Environment variables
│
├── todo-service/
│   ├── controllers/
│   │   └── todo.js           # Todo CRUD logic
│   ├── middleware/
│   │   └── auth.js           # JWT verification
│   ├── models/
│   │   └── todo.js           # Todo schema
│   ├── routes/
│   │   └── todo.js           # Todo routes
│   ├── login.html            # Login page
│   ├── register.html         # Register page
│   ├── home.html             # Dashboard
│   ├── style.css             # Styling
│   ├── app.js                # Express config
│   ├── server.js             # HTTP server
│   ├── package.json
│   └── .env (optional)
│
├── notification-service/
│   ├── index.js              # Entry point
│   └── package.json
│
├── README.md                 # Documentation
├── ABOUT.md                  # This file
└── .gitignore
```

---

## 🔍 Troubleshooting

### Port Already in Use?

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>
```

### MongoDB Connection Error?

```bash
# Make sure MongoDB is running
# Windows: mongod (atau via MongoDB Compass)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### JWT Token Error?

- Pastikan `JWT_SECRET` sama di auth-service dan todo-service
- Token expired? Login ulang (TTL: 1 hour)
- Check header: `x-auth-token` harus ada

### CORS Error?

- Pastikan semua services pakai `cors()` middleware
- Check URL di frontend, harus sesuai port service

---

## 🎓 Kesimpulan & Takeaway

Proyek ini mendemonstrasikan:

1. **Microservices Architecture**
   - Pemisahan concerns yang jelas
   - Service independence & scalability
   - Fault tolerance & resilience

2. **Security**
   - Password hashing & encryption
   - JWT authentication & authorization
   - Input validation & CORS protection

3. **Database Design**
   - Schema normalization
   - Data isolation per user
   - Proper indexing

4. **Code Quality**
   - Clean code organization
   - Meaningful error handling
   - Documentation & comments

5. **DevOps/Deployment**
   - Git workflow & version control
   - Environment configuration
   - Multiple independent services

---

## 🤝 Kontribusi

Jika ingin mengembangkan lebih lanjut:

1. Fork repository ini
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Idea untuk Enhancement

- [ ] Email verification pada registration
- [ ] Password reset functionality
- [ ] Real-time notification dengan WebSocket
- [ ] Search & filter todo
- [ ] Categories/Tags untuk todo
- [ ] Sharing todo dengan user lain
- [ ] Export todo ke PDF/CSV
- [ ] Dark mode UI
- [ ] Mobile app version (React Native)
- [ ] Kubernetes deployment configuration

---

## 📧 Kontak & Informasi

- **Developer:** Muhammad Yudha Maputra
- **Email:** [yudhay664@gmail.com]
- **GitHub:** [@muhammadyudham](https://github.com/muhammadyudham)
- **University:** [Universitas Amikom Yogyakarta]
- **Project Name:** Todo List - Microservices Project

---

## 📄 Lisensi

Proyek ini menggunakan lisensi **MIT**. Lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

**Last Updated:** January 29, 2026

_"Learning by building real-world microservices applications"_ 🚀
