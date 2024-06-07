import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { generate } from "random-words";

import { jwtMiddleware } from "../middleware/jwt";
import { DOMAIN, JWT_EXPIRATION_TIME } from "../utils/constants";
import { checkToken, TokenStatus } from "../utils/token";

export const signRouter = new Elysia().use(jwt(jwtMiddleware)).get(
  "/sign",
  async ({ cookie: { auth }, jwt, query }) => {
    const checkTokenResult = await checkToken(jwt, auth.value);

    if (checkTokenResult.status == TokenStatus.valid && !(query.force == 1)) {
      const localPart = checkTokenResult.payload?.localPart;
      const emailAddress = `${localPart ?? "Undefined"}@${DOMAIN}`;
      return emailAddress;
    } else {
      const localPart = generate({ exactly: 3, join: "-" });
      const token = await jwt.sign({ localPart });
      auth.set({
        value: token,
        httpOnly: true,
        sameSite: "strict",
        maxAge: JWT_EXPIRATION_TIME,
        path: "/",
      });
      const emailAddress = `${localPart}@${DOMAIN}`;
      return emailAddress;
    }
  },
  {
    cookie: t.Object({
      auth: t.Optional(t.String()),
    }),
    query: t.Object({
      force: t.Optional(t.Numeric({ default: 0 })),
    }),
  }
);
