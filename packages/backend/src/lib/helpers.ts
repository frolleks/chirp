import type { Context } from "hono";
import { db } from "./db";
import { posts, users } from "./db/schema";
import { eq, or } from "drizzle-orm";
import { lucia } from "./lucia";
import { setCookie } from "hono/cookie";

export async function fetchUserByIdOrUsername(id: string) {
  return db.query.users.findFirst({
    where: or(eq(users.id, id), eq(users.username, id)),
    columns: {
      id: true,
      username: true,
      createdAt: true,
    },
  });
}

export async function fetchUserWithPosts(id: string) {
  return db.query.users.findFirst({
    where: or(eq(users.id, id), eq(users.username, id)),
    columns: {
      id: true,
      username: true,
    },
    with: {
      posts: {
        columns: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
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
}

export function formatPosts(posts: any) {
  if (!posts) return [];

  return posts.posts.map((post: any) => ({
    id: post.id,
    content: post.content,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    authorId: post.authorId,
    author: {
      id: posts.id,
      username: posts.username,
    },
  }));
}

// Post route handlers

export async function createPost(
  content: string,
  authorId: string
): Promise<void> {
  await db.insert(posts).values({ content, authorId });
}

export async function fetchPostById(id: string) {
  return db.query.posts.findFirst({
    where: eq(posts.id, id),
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
}

export async function fetchPosts(limit: number) {
  return db.query.posts.findMany({
    with: {
      author: {
        columns: {
          id: true,
          username: true,
          createdAt: true,
        },
      },
    },
    limit,
  });
}

// auth route handlers

interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export async function createUser(data: SignUpData) {
  return db
    .insert(users)
    .values({
      username: data.username,
      email: data.email,
      passwordHash: await Bun.password.hash(data.password),
    })
    .returning({ id: users.id });
}

export async function findUserByEmail(email: string) {
  return db.select().from(users).where(eq(users.email, email));
}

export async function createAndSetSession(
  c: Context,
  userId: string,
  token: string | undefined
) {
  const session = await lucia.createSession(userId, {});
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
}

export async function getSessionIdFromRequest(c: Context) {
  const sessionCookie = c.req.header("Cookie");
  const tokenHeader = c.req.header("Authorization");

  let sessionId;
  if (sessionCookie) {
    sessionId = lucia.readSessionCookie(sessionCookie);
  }

  if (!sessionId && tokenHeader) {
    sessionId = lucia.readBearerToken(tokenHeader);
  }

  return sessionId as string;
}
