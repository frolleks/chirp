import { UserCircleIcon } from "lucide-react";
import Link from "next/link";

export function Post({ post }: { post: any }) {
  return (
    <div className="flex items-center gap-1.5 border-b px-2 py-1.5">
      <UserCircleIcon size={36} />
      <div>
        <Link href={`/users/${post.author.username}`}>
          <p className="text-sm font-semibold hover:underline">
            {post.author.username}
          </p>
        </Link>
        <p className="text-sm break-words break-all">{post.content}</p>
      </div>
    </div>
  );
}
