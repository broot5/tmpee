import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { createDatabase } from "./db";
import { jwt } from "@elysiajs/jwt";
import { generate } from "generate-passphrase";
import { checkToken, TokenStatus } from "./auth";

const JWT_SECRET = process.env.JWT_SECRET ?? "very secret password";
const JWT_EXPIRATION_TIME = 10 * 60; // 10 minutes

const handler = new Elysia()
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
        .query(
          "INSERT INTO emails (date, senderName, senderAddress, recipientName, recipientAddress, subject, contentHtml) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id"
        )
        .get(
          body.date.toISOString(),
          body.sender.name,
          body.sender.address,
          body.recipient.name,
          body.recipient.address,
          body.subject,
          body.contentHtml
        );
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
    const checkTokenResult = await checkToken(jwt, auth.value);

    switch (checkTokenResult.status) {
      case TokenStatus.valid: {
        const emailAddress = `${checkTokenResult.payload?.localPart as string}@tmpee.work`;
        const emails = db.query("SELECT id, date, senderAddress, subject FROM emails WHERE recipientAddress = ?").all(emailAddress);
        return emails;
      }
      case TokenStatus.invalid:
      case TokenStatus.notExist: {
        set.status = 401;
        return "Unauthorized";
      }
    }
  })
  .get(
    "/email/:id",
    async ({ cookie: { auth }, db, jwt, params: { id }, set }) => {
      const checkTokenResult = await checkToken(jwt, auth.value);

      // 권한이 없으면 error 보내도록 수정해야 함.
      switch (checkTokenResult.status) {
        case TokenStatus.valid: {
          const emailAddress = `${checkTokenResult.payload?.localPart as string}@tmpee.work`;
          const email = db.query("SELECT * FROM emails WHERE id = $id").get({
            $id: id,
          });

          if (email.recipientAddress != emailAddress) {
            set.status = 401;
            return "Unauthorized";
          }

          return email;
        }
        case TokenStatus.invalid:
        case TokenStatus.notExist: {
          set.status = 401;
          return "Unauthorized";
        }
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .get(
    "/sign",
    async ({ cookie: { auth }, jwt, query }) => {
      const checkTokenResult = await checkToken(jwt, auth.value);

      if (checkTokenResult.status == TokenStatus.valid && !(query.force == 1)) {
        const localPart = checkTokenResult.payload?.localPart as string;
        const emailAddress = `${localPart}@tmpee.work`;
        return emailAddress;
      } else {
        const localPart = generate({ length: 3, fast: true });
        const token = await jwt.sign({ localPart });
        auth.set({
          value: token,
          httpOnly: true,
          maxAge: JWT_EXPIRATION_TIME,
          path: "/",
        });
        const emailAddress = `${localPart}@tmpee.work`;
        return emailAddress;
      }
    },
    {
      query: t.Object({
        force: t.Optional(t.Numeric({ default: 0 })),
      }),
    }
  )
  .get("/", () => Bun.file("../client/index.html"));

const app = new Elysia().use(swagger()).use(handler).listen(3000);

export type App = typeof app;
