import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";

import { EmailDatabase } from "../middleware/db";
import { jwtMiddleware } from "../middleware/jwt";
import { DOMAIN } from "../utils/constants";
import { checkToken, TokenStatus } from "../utils/token";

export const emailRouter = new Elysia()
  .use(jwt(jwtMiddleware))
  .decorate("db", new EmailDatabase())
  .post(
    "/email",
    async ({ body, db, set }) => {
      const id = await db.addEmail(body);
      set.status = 201;
      return id;
    },
    {
      body: t.Object({
        date: t.Date(),
        senderName: t.String(),
        senderAddress: t.String(),
        recipientName: t.String(),
        recipientAddress: t.String(),
        subject: t.String(),
        contentHtml: t.String(),
      }),
    }
  )
  .get(
    "/email",
    async ({ cookie: { auth }, db, jwt, set }) => {
      const checkTokenResult = await checkToken(jwt, auth.value);

      switch (checkTokenResult.status) {
        case TokenStatus.valid: {
          const emailAddress = `${checkTokenResult.payload?.localPart ?? "Undefined"}@${DOMAIN}`;

          const emails = db.getEmailList(emailAddress);

          if (emails.length == 0) {
            return (
              <article class="medium middle-align center-align">
                <div>
                  <i class="extra">mail</i>
                  <h5>You have no new messages</h5>
                </div>
              </article>
            );
          }

          const list = emails
            .reverse()
            .map((email) => (
              <a hx-get={`/email/${email.id.toString()}`} hx-trigger="click" hx-target="#dialog" class="row padding wave">
                <button class="circle">A</button>
                <div class="max">
                  <h6 class="small">{email.subject}</h6>
                  <div>{email.senderAddress}</div>
                </div>
                <label>+{Math.round((new Date().valueOf() - Date.parse(email.date).valueOf()) / (1000 * 60)).toString()} min</label>
              </a>
            ))
            .join(`<div class="divider"></div>`);

          return <article>{list}</article>;
        }
        case TokenStatus.invalid:
        case TokenStatus.notExist: {
          set.status = 401;
          return "Unauthorized";
        }
      }
    },
    {
      cookie: t.Object({
        auth: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/email/:id",
    async ({ cookie: { auth }, db, jwt, params: { id }, set }) => {
      const checkTokenResult = await checkToken(jwt, auth.value);

      switch (checkTokenResult.status) {
        case TokenStatus.valid: {
          const emailAddress = `${checkTokenResult.payload?.localPart ?? "Undefined"}@${DOMAIN}`;

          const email = await db.getEmail(id);

          if (email.recipientAddress != emailAddress) {
            set.status = 401;
            return "Unauthorized";
          }

          return (
            <dialog class="active medium">
              <h5>{email.subject}</h5>
              <p>
                {email.senderName}({email.senderAddress})
              </p>
              {email.contentHtml}
              <nav class="right-align bottom">
                <button hx-trigger="click" hx-get="data:text/html," hx-target="#dialog">
                  <i>close</i>
                  <span>Close</span>
                </button>
              </nav>
            </dialog>
          );
        }
        case TokenStatus.invalid:
        case TokenStatus.notExist: {
          set.status = 401;
          return "Unauthorized";
        }
      }
    },
    {
      cookie: t.Object({
        auth: t.Optional(t.String()),
      }),
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  );
