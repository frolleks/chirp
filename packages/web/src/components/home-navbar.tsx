"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hash } from "lucide-react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/iconify-icon";

export function HomeNavbar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-56">
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
          <Hash size={20} />
          Explore
        </Button>
      </Link>
      <Link href="/sign-in" className="mt-3">
        <Button className="w-full">Sign In</Button>
      </Link>
    </div>
  );
}
