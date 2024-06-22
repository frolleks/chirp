import { UserProfile } from "@/components/user-profile";

export default function Users({ params }: { params: { slug: string } }) {
  return (
    <div>
      <UserProfile id={params.slug} />
    </div>
  );
}
