import { Hono } from "hono";
import { auth } from "./auth";
import { users } from "./users";

const app = new Hono().basePath("/v1");

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", auth);
app.route("/users", users);

export default {
  port: Number(process.env.API_PORT),
  fetch: app.fetch,
};
