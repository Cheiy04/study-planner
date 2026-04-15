const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./study-planner.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// Create tables
const createTables = () => {
    const subjectsTable = `CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
    );`;
    const studySessionsTable = `CREATE TABLE IF NOT EXISTS study_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER,
        session_date TEXT,
        duration INTEGER,
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
    );`;
    const tasksTable = `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER,
        task_name TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
    );`;
    const progressTable = `CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER,
        progress_percent INTEGER,
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
    );`;
    const notificationsTable = `CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        created_at TEXT
    );`;

    db.serialize(() => {
        db.run(subjectsTable);
        db.run(studySessionsTable);
        db.run(tasksTable);
        db.run(progressTable);
        db.run(notificationsTable);
    });
};

createTables();

db.close();