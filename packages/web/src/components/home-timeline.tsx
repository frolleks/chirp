"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function HomeTimeline() {
  const [postContent, setPostContent] = useState("");

  return (
    <div className="border h-screen">
      <div className="flex items-center w-[38rem] p-2 border-b">
        <div className="w-full">
          <form className="flex flex-col gap-y-2">
            <input
              placeholder="What is happening?!"
              className="w-full p-1.5 focus:outline-none"
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
        </div>
        <div></div>
      </div>
    </div>
  );
}
