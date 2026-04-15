// routes/schedule.js

const express = require('express');
const router = express.Router();

let studySessions = []; // This will act as an in-memory store

// GET all study sessions
router.get('/', (req, res) => {
    res.json(studySessions);
});

// GET sessions by date range
router.get('/date-range', (req, res) => {
    const { startDate, endDate } = req.query;
    const filteredSessions = studySessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= new Date(startDate) && sessionDate <= new Date(endDate);
    });
    res.json(filteredSessions);
});

// GET session by ID
router.get('/:id', (req, res) => {
    const session = studySessions.find(s => s.id === parseInt(req.params.id));
    if (session) {
        res.json(session);
    } else {
        res.status(404).send('Session not found');
    }
});

// POST create new session
router.post('/', (req, res) => {
    const newSession = { id: studySessions.length + 1, ...req.body };
    studySessions.push(newSession);
    res.status(201).json(newSession);
});

// PUT update session
router.put('/:id', (req, res) => {
    const sessionIndex = studySessions.findIndex(s => s.id === parseInt(req.params.id));
    if (sessionIndex >= 0) {
        studySessions[sessionIndex] = { id: parseInt(req.params.id), ...req.body };
        res.json(studySessions[sessionIndex]);
    } else {
        res.status(404).send('Session not found');
    }
});

// DELETE session
router.delete('/:id', (req, res) => {
    const sessionIndex = studySessions.findIndex(s => s.id === parseInt(req.params.id));
    if (sessionIndex >= 0) {
        studySessions.splice(sessionIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Session not found');
    }
});

module.exports = router;