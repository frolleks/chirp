import { Post, PostData } from "./post";

interface PostListProps {
  posts: PostData[];
}

export function PostList({ posts }: PostListProps) {
  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
