export interface Email {
  date: Date;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  subject: string;
  contentHtml: string;
}
