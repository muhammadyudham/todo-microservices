const Todo = require("../models/todo");

// 1. CREATE TODO (DENGAN MICROSERVICES)
exports.createTodo = async (req, res, next) => {
    // Log Request
    console.log((new Date()).toISOString(), req.method, req.baseUrl);

    // Persiapan Data (Cek Deadline)
    let todoData = { ...req.body };
    if (todoData.deadline === "") {
        todoData.deadline = null;
    }

    const todo = new Todo(todoData);

    try {
        // A. Simpan ke Database Utama (Service A)
        const createdTodo = await todo.save();

        // B. MICROSERVICES: Panggil Service Notifikasi (Service B)
        // Kita "menelpon" server sebelah di Port 3002
        try {
            await fetch('http://localhost:3002/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: createdTodo.title,
                    deadline: createdTodo.deadline
                })
            });
            console.log("✅ Berhasil memanggil Notification Service");
        } catch (err) {
            // Jika Service B mati, jangan bikin error aplikasi utama
            console.log("⚠️ Gagal memanggil Notification Service (Pastikan Port 3002 Nyala)");
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

    const TodoQuery = Todo.find().sort({ onDate: -1 });

    TodoQuery.then(todos => {
        if (!todos.length) {
            return res.status(404).json({
                'status': 'Success',
                'message': 'No Todos found!',
                'todos': todos,
                'todoCount': todos.length
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

    Todo.findOne({ _id: todoId }).then(todo => {
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
        { _id: todoId },
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

// 5. MARK COMPLETED
exports.completeTodo = (req, res, next) => {
    console.log((new Date()).toISOString(), req.method, req.baseUrl);
    const todoId = req.params.todoId;

    Todo.findOneAndUpdate(
        { _id: todoId },
        {
            'isCompleted': true,
            'timestamps.modifiedOn': Date.now(),
            'timestamps.completedOn': Date.now()
        },
        { new: true }
    ).then(updatedTodo => {
        res.status(201).json({
            'status': 'Success',
            'message': 'Todo Marked as Completed!',
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

// 6. DELETE TODO
exports.deleteTodo = (req, res, next) => {
    console.log((new Date()).toISOString(), req.method, req.baseUrl);
    const todoId = req.params.todoId;

    Todo.findOneAndDelete({ _id: todoId }).then(deletedTodo => {
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