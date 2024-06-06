import { JWT_SECRET } from "../utils/constants";

export const jwtMiddleware = {
  name: "jwt",
  secret: JWT_SECRET,
};
