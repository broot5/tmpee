import type { Email } from "@tmpee/shared";
import { Database } from "bun:sqlite";

type EmailList = {
  id: number;
  date: string;
  senderAddress: string;
  subject: string;
}[];

export class EmailDatabase {
  private db: Database;

  constructor() {
    this.db = new Database("emails.db");
    this.init();
  }

  init() {
    this.db.run(
      "CREATE TABLE IF NOT EXISTS emails (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, senderName TEXT NOT NULL, senderAddress TEXT NOT NULL, recipientName TEXT NOT NULL, recipientAddress TEXT NOT NULL, subject TEXT NOT NULL, contentHtml TEXT NOT NULL)"
    );
  }

  async addEmail(email: Email): Promise<number> {
    const id = await this.db
      .query(
        "INSERT INTO emails (date, senderName, senderAddress, recipientName, recipientAddress, subject, contentHtml) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id"
      )
      .get(
        email.date.toISOString(),
        email.senderName,
        email.senderAddress,
        email.recipientName,
        email.recipientAddress,
        email.subject,
        email.contentHtml
      );
    return id as number;
  }

  getEmailList(recipientAddress: string): EmailList {
    const emailList = this.db.query("SELECT id, date, senderAddress, subject FROM emails WHERE recipientAddress = ?").all(recipientAddress);

    return emailList;
  }

  async getEmail(id: number): Promise<Email> {
    const email = await this.db
      .query("SELECT date, senderName, senderAddress, recipientName, recipientAddress, subject, contentHtml FROM emails WHERE id = $id")
      .get({
        $id: id,
      });

    return email;
  }
}