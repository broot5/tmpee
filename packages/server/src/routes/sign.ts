import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { generate } from "generate-passphrase";

import { jwtMiddleware } from "../middleware/jwt";
import { JWT_EXPIRATION_TIME } from "../utils/constants";
import { checkToken, TokenStatus } from "../utils/token";

export const signRouter = new Elysia().use(jwt(jwtMiddleware)).get(
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
    cookie: t.Object({
      auth: t.Optional(t.String()),
    }),
    query: t.Object({
      force: t.Optional(t.Numeric({ default: 0 })),
    }),
  }
);
