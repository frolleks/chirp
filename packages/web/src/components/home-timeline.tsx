"use client";

import { HomePostForm } from "./home-post-form";
import { getPosts, sortPostsByDate } from "@/lib/utils";
import { assert } from "@sindresorhus/is";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostList } from "./post-list";

export function HomeTimeline() {
  const { data, isLoading, error } = getPosts();

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  assert.array(data);

  const sortedPosts = sortPostsByDate(data);

  return (
    <div className="border h-screen w-[38rem] flex flex-col">
      <div className="flex items-center p-2 border-b">
        <div className="w-full">
          <HomePostForm />
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-y-auto">
        <PostList posts={sortedPosts} />
      </ScrollArea>
    </div>
  );
}
