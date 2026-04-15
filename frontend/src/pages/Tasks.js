import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [session_id, setSessionId] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get('/api/tasks');
        setTasks(response.data);
    };

    const createTask = async () => {
        const response = await axios.post('/api/tasks', { title, description, session_id });
        setTasks([...tasks, response.data]);
        setTitle('');
        setDescription('');
    };

    const updateTask = async (id) => {
        const response = await axios.put(`/api/tasks/${id}`, { completed: true });
        setTasks(tasks.map(task => task.id === id ? response.data : task));
    };

    const deleteTask = async (id) => {
        await axios.delete(`/api/tasks/${id}`);
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <div>
            <h1>Task Manager</h1>
            <form onSubmit={(e) => { e.preventDefault(); createTask(); }}>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" required />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task Description" required></textarea>
                <input type="text" value={session_id} onChange={(e) => setSessionId(e.target.value)} placeholder="Session ID" required />
                <button type="submit">Add Task</button>
            </form>
            <div className="task-grid">
                {tasks.map(task => (
                    <div key={task.id} className="task-card">
                        <h2>{task.title}</h2>
                        <p>{task.description}</p>
                        <input type="checkbox" checked={task.completed} onChange={() => updateTask(task.id)} />
                        <button onClick={() => deleteTask(task.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
