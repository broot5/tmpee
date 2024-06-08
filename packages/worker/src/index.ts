/* eslint-disable @typescript-eslint/naming-convention */
import { treaty } from "@elysiajs/eden";
import type { App } from "@tmpee/server";
import type { Email } from "@tmpee/shared";
import PostalMime from "postal-mime";

export interface Env {
  API_HOST: string;
  API_KEY: string;
}

export default {
  async email(message: ForwardableEmailMessage, env: Env) {
    const rawEmail = new Response(message.raw);
    const arrayBuffer = await rawEmail.arrayBuffer();
    const email = await PostalMime.parse(arrayBuffer);

    if (email.to == undefined) {
      return;
    }

    const body: Email = {
      date: new Date(email.date ?? 0),
      senderName: email.from.name,
      senderAddress: email.from.address ?? "Undefined",
      recipientAddress: message.to,
      subject: email.subject ?? "Undefined",
      contentHtml: email.html ?? "Undefined",
    };

    const headers = {
      authorization: `Bearer ${env.API_KEY}`,
    };

    const client = treaty<App>(env.API_HOST);

    await client.email.post(body, { headers });
  },
};
