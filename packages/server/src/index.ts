import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { createDatabase } from "./db";
import { jwt } from "@elysiajs/jwt";
import { generate } from "generate-passphrase";

const emailWorker = new Elysia().decorate("db", createDatabase()).post(
  "/email",
  async ({ body, set, db }) => {
    await db
      .query("INSERT INTO emails (date, sender, recipient, subject, content_html) VALUES (?, ?, ?, ?, ?) RETURNING id")
      .get(body.date.toISOString(), JSON.stringify(body.sender), JSON.stringify(body.recipient), body.subject, body.contentHtml);
    set.status = 201;
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
);

const auth = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: "very secret password",
    })
  )
  .get("/sign", async ({ jwt, cookie: { auth } }) => {
    auth.set({
      value: await jwt.sign({ localPart: generate({ fast: true }) }),
      httpOnly: true,
      maxAge: 1 * 60,
      path: "/",
    });

    return auth.value as string;
  });

const getEmail = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: "very secret password",
    })
  )
  .get("/email", async ({ set, jwt, cookie: { auth } }) => {
    const value = await jwt.verify(auth.value);

    if (!value) {
      set.status = 401;
      return "Unauthorized";
    }

    return value.localPart as string;
  });

const app = new Elysia().use(swagger()).use(auth).use(emailWorker).use(getEmail).listen(3000);

export type App = typeof app;
