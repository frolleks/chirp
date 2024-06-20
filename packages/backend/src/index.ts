import { Hono } from "hono";
import { auth } from "./auth";

const app = new Hono().basePath("/v1");

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", auth);

export default app;
