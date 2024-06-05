import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { createDatabase } from "./db";
import { jwt } from "@elysiajs/jwt";
import { generate } from "generate-passphrase";

const JWT_SECRET = process.env.JWT_SECRET ?? "very secret password";

const emailHandler = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
    })
  )
  .decorate("db", createDatabase())
  .post(
    "/email",
    async ({ body, db, set }) => {
      const id = await db
        .query("INSERT INTO emails (date, sender, recipient, subject, content_html) VALUES (?, ?, ?, ?, ?) RETURNING id")
        .get(body.date.toISOString(), body.sender.address, body.recipient.address, body.subject, body.contentHtml);
      set.status = 201;
      return id;
    },
    {
      body: t.Object({
        date: t.Date(),
        sender: t.Object({
          name: t.String(),
          address: t.String(),
        }),
        recipient: t.Object({
          name: t.String(),
          address: t.String(),
        }),
        subject: t.String(),
        contentHtml: t.String(),
      }),
    }
  )
  .get("/email", async ({ cookie: { auth }, db, jwt, set }) => {
    const value = await jwt.verify(auth.value);

    if (!value) {
      set.status = 401;
      return "Unauthorized";
    }

    const emailAddress = `${value.localPart as string}@tmpee.work`;

    const emails = db.query("SELECT * FROM emails WHERE recipient = ?").all(emailAddress);

    return emails;
  });

const authHandler = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
    })
  )
  .get("/sign", async ({ cookie: { auth }, jwt }) => {
    const localPart = generate({ length: 3, fast: true });
    const token = await jwt.sign({ localPart });

    auth.set({
      value: token,
      httpOnly: true,
      maxAge: 10 * 60, // 10 minutes
      path: "/",
    });

    const emailAddress = `${localPart}@tmpee.work`;

    return emailAddress;
  });

const app = new Elysia().use(swagger()).use(authHandler).use(emailHandler).listen(3000);

export type App = typeof app;
