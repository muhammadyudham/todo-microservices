const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const todoRoutes = require("./routes/todo");

// Create an Express App
const app = express();

// --- 1. KONEKSI DATABASE (LANGSUNG) ---
// Kita pakai string langsung biar tidak error cari file credentials
const dbPath = "mongodb://127.0.0.1:27017/microservice-todo";

mongoose
  .connect(dbPath)
  .then(() => {
    console.log("✅ Todo Database Connected!");
  })
  .catch(() => {
    console.log("❌ Connection failed!");
  });

// Use body-parser to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// --- 2. CORS (PENTING) ---
app.use(cors());

// --- 3. SERVE STATIC FILES (HTML, CSS) ---
app.use(express.static('.'));

// --- 4. PERBAIKAN RUTE (PENTING) ---
// Ubah dari '/api/v1/todo' menjadi '/todos'
// Agar COCOK dengan Frontend Anda (http://localhost:3001/todos)
app.use("/todos", todoRoutes);

module.exports = app;