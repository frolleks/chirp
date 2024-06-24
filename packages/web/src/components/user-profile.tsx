"use client";

import { getPostsByUserId, getUser, sortPostsByDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { assert } from "@sindresorhus/is";
import { PostList } from "./post-list";
import { PostSWRResponse } from "./post";

export function UserProfile({ id }: { id: string }) {
  const {
    data: userData,
    isLoading: userIsLoading,
    error: userError,
  } = getUser(id);
  const {
    data: userPostsData,
    isLoading: postsIsLoading,
    error: userPostsError,
  }: PostSWRResponse = getPostsByUserId(id);

  if (userPostsError || userError) return <div>failed to load</div>;
  if (userIsLoading || postsIsLoading) return <div>loading...</div>;

  if (!userData) {
    return <div>This account doesn't exist.</div>;
  }

  assert.array(userPostsData);

  const sortedPosts = sortPostsByDate(userPostsData);

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
        <PostList posts={sortedPosts} />
      </ScrollArea>
    </div>
  );
}
