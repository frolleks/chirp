"use client";

import useSWR from "swr";
import { HomePostForm } from "./home-post-form";
import { fetcher } from "@/lib/utils";
import { assert } from "@sindresorhus/is";
import { Post } from "./post";
import { ScrollArea } from "@/components/ui/scroll-area";

export function HomeTimeline() {
  const { data, isLoading, error } = useSWR("/api/v1/posts?max=50", fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;

  assert.array(data);

  return (
    <div className="border h-screen w-[38rem] flex flex-col">
      <div className="flex items-center p-2 border-b">
        <div className="w-full">
          <HomePostForm />
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-y-auto">
        {data
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((post: any) => (
            <Post key={post.id} post={post} />
          ))}
      </ScrollArea>
    </div>
  );
}
