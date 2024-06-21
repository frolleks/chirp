import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "./lib/db";
import { users } from "./lib/db/schema";
import { eq } from "drizzle-orm";
import { lucia } from "./lib/lucia";
import { getCookie, setCookie } from "hono/cookie";

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
    const passwordHash = await Bun.password.hash(body.password);
    const { token } = c.req.query();

    try {
      const user = await db
        .insert(users)
        .values({
          username: body.username,
          email: body.email,
          passwordHash,
        })
        .returning({ id: users.id });

      const session = await lucia.createSession(user[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      if (token === "true") {
        return c.json({ token: session.id }, 201);
      }

      setCookie(
        c,
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      return c.redirect("/", 302);
    } catch (error) {
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
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email));
    const { token } = c.req.query();

    if (!user) {
      return c.json({ error: "Invalid email or password" }, 400);
    }

    const validPassword = await Bun.password.verify(
      body.password,
      user[0].passwordHash!
    );

    if (!validPassword) {
      return c.json({ error: "Invalid email or password" }, 400);
    }

    const session = await lucia.createSession(user[0].id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    if (token === "true") {
      return c.json({ token: session.id });
    }

    setCookie(c, "auth_token", sessionCookie.serialize());

    return c.redirect("/", 302);
  }
);

auth.get("/session", async (c) => {
  try {
    const sessionCookie = c.req.header("Cookie");
    const tokenHeader = c.req.header("Authorization");

    if (!sessionCookie && !tokenHeader) {
      return c.status(401);
    }

    let sessionId;
    if (sessionCookie) {
      sessionId = lucia.readSessionCookie(sessionCookie);
    }

    if (sessionId) {
      const { user } = await lucia.validateSession(sessionId);
      return c.json({ user });
    }

    let bearerToken;
    if (tokenHeader) {
      bearerToken = lucia.readBearerToken(tokenHeader);
    }

    if (bearerToken) {
      const { user } = await lucia.validateSession(bearerToken);
      return c.json({ user });
    }

    return c.status(401);
  } catch (error) {
    console.error("Error validating session:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});
