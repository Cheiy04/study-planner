const express = require('express');
const cors = require('cors');
const dbInit = require('./dbInit'); // database initialization

const subjectsRouter = require('./routes/subjects');
const scheduleRouter = require('./routes/schedule');
const tasksRouter = require('./routes/tasks');
const progressRouter = require('./routes/progress');
const pdfRouter = require('./routes/pdf');

const app = express();
app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api/subjects', subjectsRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/progress', progressRouter);
app.use('/api/pdf', pdfRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Initialize the database
dbInit();

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
