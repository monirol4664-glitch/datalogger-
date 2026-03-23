CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    major TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
