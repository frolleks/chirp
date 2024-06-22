import { Hono } from "hono";
import { lucia } from "./lib/lucia";
import { getCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "./lib/db";
import { posts as postsTable } from "./lib/db/schema";
import { eq } from "drizzle-orm";

export const posts = new Hono();

posts.post(
  "/new",
  zValidator(
    "json",
    z.object({
      content: z.string().max(500),
    })
  ),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const sessionId =
        getCookie(c, "auth_session") || c.req.header("Authorization");

      if (!sessionId) {
        return c.status(401);
      }

      const session = await lucia.validateSession(sessionId);

      if (!session) {
        return c.status(401);
      }

      await db
        .insert(postsTable)
        .values({ content: body.content, authorId: session.user?.id });

      return c.json({ message: "Post successfully created!" }, 201);
    } catch (error) {
      console.error(error);
      return c.status(500);
    }
  }
);

posts.get("/:id", async (c) => {
  const id = c.req.param("id");

  const post = await db.query.posts.findFirst({
    where: eq(postsTable.id, id),
    with: {
      author: {
        columns: {
          id: true,
          username: true,
          createdAt: true,
        },
      },
    },
  });

  return c.json(post);
});

posts.get("/", async (c) => {
  const maxPosts = Number(c.req.query("max"));

  if (maxPosts <= 50) {
    const allPosts = await db.query.posts.findMany({
      with: {
        author: {
          columns: {
            id: true,
            username: true,
            createdAt: true,
          },
        },
      },
    });

    return c.json(allPosts);
  }

  return c.status(400);
});
