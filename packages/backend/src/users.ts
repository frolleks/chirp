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

    const posts = await db.query.users.findFirst({
      where: or(eq(usersTable.id, id), eq(usersTable.username, id)),
      columns: {
        id: true, // Include user id
        username: true,
      },
      with: {
        posts: {
          columns: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            authorId: true, // Include authorId
          },
          with: {
            author: {
              columns: {
                id: true,
                username: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    // Transform the response to match the desired output
    const formattedPosts =
      posts?.posts.map((post) => ({
        id: post.id,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        authorId: post.authorId,
        author: {
          id: posts.id, // Include author id
          username: posts.username,
        },
      })) ?? [];

    if (!posts) {
      return c.status(404);
    }

    return c.json(formattedPosts);
  } catch (error) {
    return c.status(500);
  }
});
