const Todo = require("../models/todo");
const axios = require('axios'); // <--- PANGGIL AXIOS (Pengganti Fetch)

// 1. CREATE TODO (DENGAN MICROSERVICES)
exports.createTodo = async (req, res, next) => {
    // Log Request
    console.log((new Date()).toISOString(), req.method, req.baseUrl);

    // Persiapan Data (Cek Deadline)
    let todoData = { ...req.body, userId: req.user.id };
    if (todoData.deadline === "") {
        todoData.deadline = null;
    }

    const todo = new Todo(todoData);

    try {
        // A. Simpan ke Database Utama (Service A)
        const createdTodo = await todo.save();

        // B. MICROSERVICES: Panggil Service Notifikasi (Service B)
        // Kita gunakan AXIOS ke Port 3002
        try {
            await axios.post('http://localhost:3002/notify', {
                title: createdTodo.title,
                deadline: createdTodo.deadline,
                email: 'user_demo@gmail.com' 
            });
            console.log("✅ Berhasil memanggil Notification Service");
        } catch (err) {
            // Jika Service B mati, aplikasi utama TIDAK BOLEH error. Cukup di-log saja.
            console.error("⚠️ Gagal memanggil Notification Service (Pastikan Port 3002 Nyala)");
        }

        // C. Kirim Respon Sukses ke User
        res.status(201).json({
            'status': 'Success',
            'message': 'Todo Created SuccessFully!',
            'todo': {
                ...createdTodo._doc,
                todoId: createdTodo._id
            }
        });

    } catch (error) {
        // Jika Database Error
        res.status(500).json({
            'status': 'Error',
            'message': 'Error in DB Operation!',
            'error': error
        });
    }
}

// 2. GET ALL TODOS
exports.getTodos = (req, res, next) => {
    console.log((new Date()).toISOString(), req.method, req.baseUrl);

    const TodoQuery = Todo.find({ userId: req.user.id }).sort({ onDate: -1 });

    TodoQuery.then(todos => {
        if (!todos.length) {
            return res.status(200).json({ 
                'status': 'Success',
                'message': 'No Todos found!',
                'todos': [],
                'todoCount': 0
            });
        }
        res.status(200).json({
            'status': 'Success',
            'message': 'Todos Fetched Successfully!',
            'todos': todos,
            'todoCount': todos.length
        });
    }).catch(error => {
        res.status(500).json({
            'status': 'Error',
            'message': 'Error in DB Operation!',
            'error': error
        });
    });
}

// 3. GET SPECIFIC TODO
exports.getTodo = (req, res, next) => {
    console.log((new Date()).toISOString(), req.method, req.baseUrl);
    const todoId = req.params.todoId;

    Todo.findOne({ _id: todoId, userId: req.user.id }).then(todo => {
        if (!todo) {
            return res.status(404).json({
                'status': 'Success',
                'message': 'No Todo found with that Id!',
                'todo': todo
            });
        }
        res.status(200).json({
            'status': 'Success',
            'message': 'Todo Fetched Successfully!',
            'todo': todo
        });
    }).catch(error => {
        res.status(500).json({
            'status': 'Error',
            'message': 'Error in DB Operation!',
            'error': error
        });
    });
}

// 4. UPDATE TODO
exports.updateTodo = (req, res, next) => {
    console.log((new Date()).toISOString(), req.method, req.baseUrl);
    const todoId = req.params.todoId;

    // Cek Deadline saat update
    const data = { ...req.body };
    if (data.deadline === "") {
        data.deadline = null;
    }

    Todo.findOneAndUpdate(
        { _id: todoId, userId: req.user.id },
        { ...data, 'timestamps.modifiedOn': Date.now() },
        { new: true }
    ).then(updatedTodo => {
        res.status(201).json({
            'status': 'Success',
            'message': 'Todo Updated Successfully!',
            'todo': updatedTodo
        });
    }).catch(error => {
        res.status(500).json({
            'status': 'Error',
            'message': 'Error in DB Operation!',
            'error': error
        });
    });
}

// 5. MARK COMPLETED (TOGGLE / SAKLAR) - UPDATED!
exports.completeTodo = async (req, res, next) => {
    console.log((new Date()).toISOString(), req.method, req.baseUrl);
    const todoId = req.params.todoId;

    try {
        // 1. Cari dulu tugasnya
        const todo = await Todo.findOne({ _id: todoId, userId: req.user.id });
        
        if (!todo) {
            return res.status(404).json({ 
                status: 'Error', 
                message: "Tugas tidak ditemukan" 
            });
        }

        // 2. Balikkan statusnya (True jadi False, False jadi True)
        todo.isCompleted = !todo.isCompleted;
        
        // 3. Update timestamp
        todo.timestamps.modifiedOn = Date.now();
        if (todo.isCompleted) {
            todo.timestamps.completedOn = Date.now();
        }

        // 4. Simpan perubahan
        const updatedTodo = await todo.save();

        res.status(201).json({
            'status': 'Success',
            'message': todo.isCompleted ? 'Tugas Selesai!' : 'Status Dibatalkan (Aktif Kembali)',
            'todo': updatedTodo
        });

    } catch (error) {
        res.status(500).json({
            'status': 'Error',
            'message': 'Error in DB Operation!',
            'error': error.message
        });
    }
}

// 6. DELETE TODO
exports.deleteTodo = (req, res, next) => {
    console.log((new Date()).toISOString(), req.method, req.baseUrl);
    const todoId = req.params.todoId;

    Todo.findOneAndDelete({ _id: todoId, userId: req.user.id }).then(deletedTodo => {
        res.status(201).json({
            'status': 'Success',
            'message': 'Todo Deleted Successfully!'
        });
    }).catch(error => {
        res.status(500).json({
            'status': 'Error',
            'message': 'Error in DB Operation!',
            'error': error
        });
    });
}