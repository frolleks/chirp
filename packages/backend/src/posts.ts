import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getCookie } from "hono/cookie";
import {
  createPost,
  fetchPostById,
  fetchPosts,
  getSessionIdFromRequest,
} from "./lib/helpers";
import { lucia } from "./lib/lucia";

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
      const sessionId = await getSessionIdFromRequest(c);

      const session = await lucia.validateSession(sessionId);

      if (!session) {
        return c.status(401);
      }

      await createPost(body.content, session.user!.id);

      return c.json({ message: "Post successfully created!" }, 201);
    } catch (error) {
      console.error(error);
      return c.status(500);
    }
  }
);

posts.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const post = await fetchPostById(id);

    if (!post) {
      return c.status(404);
    }

    return c.json(post);
  } catch (error) {
    console.error(error);
    return c.status(500);
  }
});

posts.get("/", async (c) => {
  try {
    const maxPosts = Number(c.req.query("max"));

    if (isNaN(maxPosts) || maxPosts > 50) {
      return c.status(400);
    }

    const allPosts = await fetchPosts(maxPosts);

    return c.json(allPosts);
  } catch (error) {
    console.error(error);
    return c.status(500);
  }
});
