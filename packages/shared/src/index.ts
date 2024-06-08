export interface Email {
  date: Date;
  senderName: string;
  senderAddress: string;
  recipientAddress: string;
  subject: string;
  contentHtml: string;
}
