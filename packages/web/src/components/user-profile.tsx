"use client";

import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Post } from "./post";
import { assert } from "@sindresorhus/is";

export function UserProfile({ id }: { id: string }) {
  const {
    data: userData,
    isLoading: userIsLoading,
    error: userError,
  } = useSWR(`/api/v1/users/${id}`, fetcher);
  const {
    data: userPostsData,
    isLoading: postsIsLoading,
    error: userPostsError,
  } = useSWR(`/api/v1/users/${id}/posts`, fetcher);

  if (userPostsError || userError) return <div>failed to load</div>;
  if (userIsLoading || postsIsLoading) return <div>loading...</div>;

  if (!userData) {
    return <div>This account doesn't exist.</div>;
  }

  assert.array(userPostsData);

  return (
    <div className="border h-screen w-[38rem] flex flex-col">
      <div className="p-1.5 border-b">
        <div className="flex items-center w-[37rem]">
          <div className="flex w-full justify-start">
            <p className="font-semibold text-lg">@{userData.username}</p>
          </div>
          <div className="flex w-full justify-end">
            <Button>Edit Profile</Button>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-y-auto">
        {userPostsData
          .sort(
            (a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt)
          )
          .map((post: any) => (
            <Post key={post.id} post={post} />
          ))}
      </ScrollArea>
    </div>
  );
}
