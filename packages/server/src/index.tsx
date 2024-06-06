import { html } from "@elysiajs/html";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";

import { emailRouter } from "./routes/email";
import { homeRouter } from "./routes/home";
import { signRouter } from "./routes/sign";

const app = new Elysia().use(swagger()).use(html()).use(homeRouter).use(signRouter).use(emailRouter).listen(3000);

export type App = typeof app;
