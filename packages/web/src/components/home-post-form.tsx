"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { Button } from "@/components/ui/button";

export function HomePostForm() {
  const [postContent, setPostContent] = useState("");
  const { mutate } = useSWRConfig();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      // Mutate the cache by posting new data
      await mutate(
        "/api/v1/posts/new",
        async () => {
          const response = await fetch("/api/v1/posts/new", {
            method: "POST",
            body: JSON.stringify({
              content: postContent,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          return await response.json();
        },
        false
      );

      setPostContent("");
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  }

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
