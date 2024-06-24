import { Hono } from "hono";
import {
  fetchUserByIdOrUsername,
  fetchUserWithPosts,
  formatPosts,
} from "./lib/helpers";

export const users = new Hono();

users.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const user = await fetchUserByIdOrUsername(id);

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
    const userWithPosts = await fetchUserWithPosts(id);

    if (!userWithPosts) {
      return c.status(404);
    }

    const formattedPosts = formatPosts(userWithPosts);
    return c.json(formattedPosts);
  } catch (error) {
    console.error(error);
    return c.status(500);
  }
});
