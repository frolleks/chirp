import { PostData, PostSWRResponse } from "@/components/post";
import { type ClassValue, clsx } from "clsx";
import useSWR, { type SWRResponse } from "swr";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Wrapper for fetch for use with swr.
 * @param args
 */
export const fetcher = (args: any) => fetch(args).then((res) => res.json());

/**
 * A React hook for getting the session data.
 *
 * @export
 * @return {SWRResponse<any, any, any>}
 */
export function useSession() {
  return useSWR("/api/v1/auth/session", fetcher);
}

export async function fetchPosts() {
  const response = await fetch("/api/v1/posts?max=50");
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return await response.json();
}

export function sortPostsByDate(posts: PostData[]): PostData[] {
  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getUser(id: string) {
  const result = useSWR(`/api/v1/users/${id}`, fetcher);

  return result;
}

export function getPostsByUserId(id: string) {
  const result: PostSWRResponse = useSWR(`/api/v1/users/${id}/posts`, fetcher);

  return result;
}

export function getPosts() {
  const result: PostSWRResponse = useSWR("/api/v1/posts?max=50", fetcher);

  return result;
}
