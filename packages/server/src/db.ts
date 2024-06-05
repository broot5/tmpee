import Database from "bun:sqlite";

export const createDatabase = () => {
  const db = new Database("emails.db");
  db.run(
    "CREATE TABLE IF NOT EXISTS emails (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, sender TEXT NOT NULL, recipient TEXT NOT NULL, subject TEXT NOT NULL, content_html TEXT NOT NULL)"
  );
  return db;
};
