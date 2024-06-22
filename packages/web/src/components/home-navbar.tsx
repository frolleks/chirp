"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/iconify-icon";
import { useSession } from "@/lib/utils";

export function HomeNavbar() {
  const pathname = usePathname();
  const { data: session, isLoading, error } = useSession();

  return (
    <div className="flex flex-col w-64 h-screen">
      <Link href="/">
        <p className="p-3 font-semibold">chirp</p>
      </Link>

      <Link href="/">
        <Button
          className="justify-start gap-2 w-full"
          variant="ghost"
          size="sm"
        >
          {pathname === "/" ? (
            <Icon icon="fluent:home-48-filled" fontSize={20} />
          ) : (
            <Icon icon="fluent:home-48-regular" fontSize={20} />
          )}
          Home
        </Button>
      </Link>
      <Link href="/explore">
        <Button
          className="justify-start gap-2 w-full"
          variant="ghost"
          size="sm"
        >
          {pathname === `/explore` ? (
            <Icon icon="ph:hash-bold" fontSize={20} />
          ) : (
            <Icon icon="ph:hash" fontSize={20} />
          )}
          Explore
        </Button>
      </Link>
      {session ? (
        <Link href={`/users/${session.user.id}`}>
          <Button
            className="justify-start gap-2 w-full"
            variant="ghost"
            size="sm"
          >
            {pathname === `/users/${session.user.id}` ? (
              <Icon icon="bxs:user" fontSize={20} />
            ) : (
              <Icon icon="bx:user" fontSize={20} />
            )}
            Profile
          </Button>
        </Link>
      ) : (
        <></>
      )}

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
