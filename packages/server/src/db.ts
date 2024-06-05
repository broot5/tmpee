import Database from "bun:sqlite";

export const createDatabase = () => {
  const db = new Database("emails.db");
  db.run(
    "CREATE TABLE IF NOT EXISTS emails (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, senderName TEXT NOT NULL, senderAddress TEXT NOT NULL, recipientName TEXT NOT NULL, recipientAddress TEXT NOT NULL, subject TEXT NOT NULL, contentHtml TEXT NOT NULL)"
  );
  return db;
};
