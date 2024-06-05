export interface Address {
  name: string;
  address: string;
}

export interface Email {
  date: Date;
  sender: Address;
  recipient: Address;
  subject: string;
  contentHtml: string;
}
