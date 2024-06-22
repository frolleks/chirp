import { Hono } from "hono";
import { db } from "./lib/db";
import { users as usersTable, posts as postsTable } from "./lib/db/schema";
import { eq, or } from "drizzle-orm";

export const users = new Hono();

users.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const user = await db.query.users.findFirst({
      where: or(eq(usersTable.id, id), eq(usersTable.username, id)),
      columns: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    if (!user) {
      return c.status(404);
    }

    return c.json(user);
  } catch (error) {
    console.error(error);
    return c.status(500);
  }
});

users.get("/:id/posts", async (c) => {
  try {
    const id = c.req.param("id");

    const posts = await db.query.posts.findMany({
      where: eq(postsTable.authorId, id),
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

    if (!posts) {
      return c.status(404);
    }

    return c.json(posts);
  } catch (error) {
    return c.status(500);
  }
});
