import PostalMime from "postal-mime";
import { treaty } from "@elysiajs/eden";
import type { App } from "@tmpee/server";
import type { Address } from "./types";
import { new_address } from "./types";

export default {
  async email(message: EmailMessage) {
    const rawEmail = new Response(message.raw);
    const arrayBuffer = await rawEmail.arrayBuffer();
    const email = await PostalMime.parse(arrayBuffer);

    interface EmailBody {
      date: Date;
      from: Address;
      to: Address[];
      subject: string;
      content_html: string;
    }

    const body: EmailBody = {
      date: new Date(email.date ?? ""),
      from: new_address(email.from),
      to: email.to?.map((undefined_address) => new_address(undefined_address)) ?? [],
      subject: email.subject ?? "Undefined",
      content_html: email.html ?? "Undefined",
    };

    const client = treaty<App>("https://talented-civet-pleasantly.ngrok-free.app/");

    await client.email.post(body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
