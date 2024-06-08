import type { Email } from "@tmpee/shared";
import { Database } from "bun:sqlite";

import { DB_PATH } from "../utils/constants";

type EmailList = {
  id: number;
  date: string;
  senderAddress: string;
  subject: string;
}[];

export class EmailDatabase {
  private db: Database;

  constructor() {
    this.db = new Database(DB_PATH);
    this.init();
  }

  init() {
    this.db.run(
      "CREATE TABLE IF NOT EXISTS emails (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, senderName TEXT NOT NULL, senderAddress TEXT NOT NULL, recipientAddress TEXT NOT NULL, subject TEXT NOT NULL, contentHtml TEXT NOT NULL)"
    );
  }

  async addEmail(email: Email): Promise<number> {
    const id = await this.db
      .query(
        "INSERT INTO emails (date, senderName, senderAddress, recipientAddress, subject, contentHtml) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id"
      )
      .get(email.date.toISOString(), email.senderName, email.senderAddress, email.recipientAddress, email.subject, email.contentHtml);
    return id as number;
  }

  getEmailList(recipientAddress: string): EmailList {
    const emailList = this.db.query("SELECT id, date, senderAddress, subject FROM emails WHERE recipientAddress = ?").all(recipientAddress);

    return emailList as EmailList;
  }

  getEmail(id: number): Email {
    const email = this.db
      .query("SELECT date, senderName, senderAddress, recipientAddress, subject, contentHtml FROM emails WHERE id = $id")
      .get({
        $id: id,
      });

    return email as Email;
  }
}
