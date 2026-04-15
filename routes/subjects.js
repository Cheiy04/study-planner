const express = require('express');
const router = express.Router();

// Sample in-memory storage for subjects; replace with database in production
let subjects = [];

// GET all subjects
router.get('/', (req, res) => {
    res.status(200).json(subjects);
});

// GET subject by ID
router.get('/:id', (req, res) => {
    const subject = subjects.find(s => s.id === parseInt(req.params.id));
    if (!subject) return res.status(404).send('Subject not found.');
    res.status(200).json(subject);
});

// POST create subject
router.post('/', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).send('Subject name is required.');

    const newSubject = {
        id: subjects.length + 1,
        name
    };
    subjects.push(newSubject);
    res.status(201).json(newSubject);
});

// PUT update subject
router.put('/:id', (req, res) => {
    const subject = subjects.find(s => s.id === parseInt(req.params.id));
    if (!subject) return res.status(404).send('Subject not found.');
    
    const { name } = req.body;
    if (!name) return res.status(400).send('Subject name is required.');

    subject.name = name;
    res.status(200).json(subject);
});

// DELETE subject
router.delete('/:id', (req, res) => {
    const subjectIndex = subjects.findIndex(s => s.id === parseInt(req.params.id));
    if (subjectIndex === -1) return res.status(404).send('Subject not found.');

    const deletedSubject = subjects.splice(subjectIndex, 1);
    res.status(200).json(deletedSubject);
});

module.exports = router;