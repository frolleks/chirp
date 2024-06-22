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
      // Submit the form data using Fetch API
      await fetch("/api/v1/posts/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: postContent }),
      });

      // Clear the form after successful submission
      setPostContent("");

      // Trigger a revalidation of the posts
      mutate(
        "/api/v1/posts?max=50",
        async () => {
          const response = await fetch("/api/v1/posts?max=50");
          const data = await response.json();
          return data;
        },
        true
      );
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
