import { HomePostForm } from "./home-post-form";

export function HomeTimeline() {
  return (
    <div className="border h-screen">
      <div className="flex items-center w-[38rem] p-2 border-b">
        <div className="w-full">
          <HomePostForm />
        </div>
        <div></div>
      </div>
    </div>
  );
}
