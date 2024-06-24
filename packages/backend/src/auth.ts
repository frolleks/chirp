import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  createUser,
  findUserByEmail,
  createAndSetSession,
  getSessionIdFromRequest,
} from "./lib/helpers";
import { lucia } from "./lib/lucia";

export const auth = new Hono();

auth.post(
  "/sign-up",
  zValidator(
    "json",
    z.object({
      username: z.string().max(64),
      email: z.string().email(),
      password: z.string().min(8).max(128),
    })
  ),
  async (c) => {
    const body = c.req.valid("json");

    try {
      const user = await createUser(body);
      const { token } = c.req.query();

      return await createAndSetSession(c, user[0].id, token);
    } catch (error) {
      console.error("Error creating user:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

auth.post(
  "/sign-in",
  zValidator(
    "json",
    z.object({
      email: z.string().email(),
      password: z.string().min(8).max(128),
    })
  ),
  async (c) => {
    const body = c.req.valid("json");

    try {
      const user = await findUserByEmail(body.email);

      if (!user.length) {
        return c.json({ error: "Invalid email or password" }, 400);
      }

      const validPassword = await Bun.password.verify(
        body.password,
        user[0].passwordHash!
      );

      if (!validPassword) {
        return c.json({ error: "Invalid email or password" }, 400);
      }

      const { token } = c.req.query();

      return await createAndSetSession(c, user[0].id, token);
    } catch (error) {
      console.error("Error signing in:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

auth.get("/session", async (c) => {
  try {
    const sessionId = await getSessionIdFromRequest(c);

    if (!sessionId) {
      return c.status(401);
    }

    const { user } = await lucia.validateSession(sessionId);
    return c.json({ user });
  } catch (error) {
    console.error("Error validating session:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});
