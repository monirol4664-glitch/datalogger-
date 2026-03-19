-- schema.sql (FINAL)

CREATE TABLE students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  reg TEXT,
  roll TEXT,
  father TEXT,
  role TEXT DEFAULT 'student' -- admin/student
);

CREATE TABLE payment_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  grade TEXT,
  name TEXT,
  amount TEXT
);

CREATE TABLE results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER,
  grade TEXT,
  subject TEXT,
  result_grade TEXT,
  cgpa TEXT
);

CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER,
  payment_id INTEGER,
  status TEXT
);

-- DEFAULT ADMIN (ADD FROM DB CONSOLE)
-- INSERT INTO students (name,email,password,role)
-- VALUES ('Admin','admin@gmail.com','admin123','admin');