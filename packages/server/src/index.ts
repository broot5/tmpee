import { Elysia, t } from "elysia";

const app = new Elysia()
  .post(
    "/email",
    ({ body }) => {
      return "Successfully received Email data";
    },
    {
      body: t.Object({
        date: t.Date(),
        from: t.Object({
          name: t.String(),
          address: t.String(),
        }),
        to: t.Array(
          t.Object({
            name: t.String(),
            address: t.String(),
          })
        ),
        subject: t.String(),
        content_html: t.String(),
      }),
    }
  )
  .listen(3000);

export type App = typeof app;
