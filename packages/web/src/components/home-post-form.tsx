"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { Button } from "@/components/ui/button";
import { fetchPosts } from "@/lib/utils";

async function submitPost(content: string) {
  const response = await fetch("/api/v1/posts/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit post");
  }
}

export function HomePostForm() {
  const [postContent, setPostContent] = useState<string>("");
  const { mutate } = useSWRConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitPost(postContent);

      setPostContent("");

      await mutate("/api/v1/posts?max=50", fetchPosts, true);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <form className="flex flex-col gap-y-2" onSubmit={handleSubmit}>
      <input
        placeholder="What is happening?!"
        className="w-full p-1.5 focus:outline-none"
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
      />
      <Button
        className="w-full transition-all"
        disabled={postContent.length === 0}
        type="submit"
      >
        Post
      </Button>
    </form>
  );
}
