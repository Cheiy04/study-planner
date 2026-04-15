const express = require('express');
const router = express.Router();

let progress = [];

router.get('/', (req, res) => {
    res.json(progress);
});

router.get('/weekly/:week', (req, res) => {
    const week = req.params.week;
    const weeklyProgress = progress.filter(p => p.week === week);
    res.json(weeklyProgress);
});

router.get('/subject/:subject_id', (req, res) => {
    const subjectId = req.params.subject_id;
    const subjectProgress = progress.filter(p => p.subject_id === subjectId);
    res.json(subjectProgress);
});

router.get('/analytics/overview', (req, res) => {
    const totalHours = progress.reduce((sum, p) => sum + p.hours_studied, 0);
    const totalSessions = progress.reduce((sum, p) => sum + p.sessions_completed, 0);
    const averageProgress = progress.length > 0 ? (totalHours / progress.length).toFixed(2) : 0;
    res.json({
        total_hours_studied: totalHours,
        total_sessions_completed: totalSessions,
        average_progress: averageProgress,
        total_records: progress.length
    });
});

router.get('/record/:id', (req, res) => {
    const progressId = req.params.id;
    const progressRecord = progress.find(p => p.id === progressId);
    if (progressRecord) {
        res.json(progressRecord);
    } else {
        res.status(404).json({ error: 'Progress record not found' });
    }
});

router.post('/', (req, res) => {
    const { subject_id, week, hours_studied, sessions_completed, target_hours } = req.body;
    if (!subject_id || !week) {
        return res.status(400).json({ error: 'subject_id and week are required' });
    }
    const newProgress = {
        id: progress.length + 1,
        subject_id,
        week,
        hours_studied: hours_studied || 0,
        sessions_completed: sessions_completed || 0,
        target_hours: target_hours || 5,
        created_at: new Date().toISOString()
    };
    progress.push(newProgress);
    res.status(201).json(newProgress);
});

router.put('/:id', (req, res) => {
    const progressId = req.params.id;
    const progressRecord = progress.find(p => p.id === progressId);
    if (progressRecord) {
        const { hours_studied, sessions_completed, target_hours } = req.body;
        if (hours_studied !== undefined) progressRecord.hours_studied = hours_studied;
        if (sessions_completed !== undefined) progressRecord.sessions_completed = sessions_completed;
        if (target_hours !== undefined) progressRecord.target_hours = target_hours;
        res.json(progressRecord);
    } else {
        res.status(404).json({ error: 'Progress record not found' });
    }
});

router.delete('/:id', (req, res) => {
    const progressId = req.params.id;
    const index = progress.findIndex(p => p.id === progressId);
    if (index >= 0) {
        progress.splice(index, 1);
        res.json({ message: 'Progress record deleted successfully' });
    } else {
        res.status(404).json({ error: 'Progress record not found' });
    }
});

module.exports = router;