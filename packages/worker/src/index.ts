import { treaty } from "@elysiajs/eden";
import type { App } from "@tmpee/server";
import type { Email } from "@tmpee/shared";
import PostalMime from "postal-mime";

export default {
  async email(message: EmailMessage) {
    const rawEmail = new Response(message.raw);
    const arrayBuffer = await rawEmail.arrayBuffer();
    const email = await PostalMime.parse(arrayBuffer);

    const body: Email = {
      date: new Date(email.date ?? ""),
      senderName: email.from.name,
      senderAddress: email.from.address ?? "Undefined",
      recipientName: email.to[0].name,
      recipientAddress: email.to[0].address ?? "Undefined",
      subject: email.subject ?? "Undefined",
      contentHtml: email.html ?? "Undefined",
    };

    const client = treaty<App>("https://talented-civet-pleasantly.ngrok-free.app/");

    await client.email.post(body);
  },
};
