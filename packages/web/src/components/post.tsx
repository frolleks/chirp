import { UserCircleIcon } from "lucide-react";

export function Post({ post }: { post: any }) {
  return (
    <div className="flex items-center gap-1.5 border-b px-2 py-1.5">
      <UserCircleIcon size={36} />
      <div className="w-full">
        <p className="text-sm font-semibold">{post.author.username}</p>
        <p className="text-sm break-words break-all">{post.content}</p>
      </div>
    </div>
  );
}
