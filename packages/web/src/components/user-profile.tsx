"use client";

import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { Button } from "@/components/ui/button";

export function UserProfile({ id }: { id: string }) {
  const { data, isLoading, error } = useSWR(`/api/v1/users/${id}`, fetcher);

  if (!data) {
    return <div>This account doesn't exist.</div>;
  }

  return (
    <div className="p-1.5 border">
      <div className="flex items-center w-[38rem]">
        <div className="flex w-full justify-start">
          <p className="font-semibold text-lg">@{data.username}</p>
        </div>
        <div className="flex w-full justify-end">
          <Button>Edit Profile</Button>
        </div>
      </div>
    </div>
  );
}
