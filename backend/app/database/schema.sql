-- backend/app/database/schema.sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_english TEXT,
  name_persian TEXT,
  email_azki TEXT,
  personal_email TEXT,
  position TEXT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  qa_total INTEGER,
  qc_total INTEGER,
  rank TEXT,
  personnel_code TEXT,
  role TEXT,
  number TEXT
);
