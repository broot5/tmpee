import { t } from "elysia";

import { JWT_SECRET } from "../utils/constants";

export const jwtMiddleware = {
  name: "jwt",
  secret: JWT_SECRET,
  schema: t.Object({
    localPart: t.String(),
  }),
};
