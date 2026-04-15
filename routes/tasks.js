// Import required modules
const express = require('express');
const router = express.Router();

// Sample tasks array
let tasks = [];

// GET all tasks
router.get('/', (req, res) => {
    res.json(tasks);
});

// GET tasks by session ID
router.get('/session/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    const filteredTasks = tasks.filter(task => task.sessionId === sessionId);
    res.json(filteredTasks);
});

// GET task by ID
router.get('/:id', (req, res) => {
    const taskId = req.params.id;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

// POST create new task
router.post('/', (req, res) => {
    const newTask = req.body;
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT update task (mark as complete)
router.put('/:id', (req, res) => {
    const taskId = req.params.id;
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = true;
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
});

// DELETE task
router.delete('/:id', (req, res) => {
    const taskId = req.params.id;
    tasks = tasks.filter(t => t.id !== taskId);
    res.status(204).send();
});

module.exports = router;