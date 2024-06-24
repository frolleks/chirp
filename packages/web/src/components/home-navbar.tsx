"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useSession } from "@/lib/utils";
import { ProfileLink } from "./profile-link";
import { NavLink } from "./nav-link";

export function HomeNavbar() {
  const pathname = usePathname();
  const { data: session, isLoading, error } = useSession();

  return (
    <div className="flex flex-col w-64 h-screen">
      <Link href="/">
        <p className="p-3 font-semibold">chirp</p>
      </Link>
      <NavLink
        href="/"
        isActive={pathname === "/"}
        iconActive="fluent:home-48-filled"
        iconInactive="fluent:home-48-regular"
      >
        Home
      </NavLink>
      <NavLink
        href="/explore"
        isActive={pathname === "/explore"}
        iconActive="ph:hash-bold"
        iconInactive="ph:hash"
      >
        Explore
      </NavLink>
      {session && <ProfileLink session={session} pathname={pathname} />}
      {session ? (
        <Button className="mt-3">Post</Button>
      ) : (
        <Link href="/sign-in" className="mt-3">
          <Button className="w-full">Sign In</Button>
        </Link>
      )}
    </div>
  );
}
