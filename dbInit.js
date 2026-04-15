const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./study-planner.db', (err) => {
    if (err) {
        console.error('Error opening database: ' + err.message);
    } else {
        console.log('Connected to database');
    }
});

const initDatabase = () => {
    const usersTable = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`;

    const subjectsTable = `CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );`;

    const scheduleTable = `CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        subject_id INTEGER,
        date TEXT NOT NULL,
        start_time TEXT,
        end_time TEXT,
        planned_duration REAL,
        actual_duration REAL,
        completed BOOLEAN DEFAULT 0,
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (subject_id) REFERENCES subjects(id)
    );`;

    const tasksTable = `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        session_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (session_id) REFERENCES schedule(id)
    );`;

    const progressTable = `CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        week INTEGER,
        hours_studied REAL,
        sessions_completed INTEGER,
        target_hours REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );`;

    db.serialize(() => {
        db.run(usersTable);
        db.run(subjectsTable);
        db.run(scheduleTable);
        db.run(tasksTable);
        db.run(progressTable);
    });
};

initDatabase();

module.exports = db;
