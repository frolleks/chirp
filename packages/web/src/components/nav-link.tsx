import { Icon } from "./iconify-icon";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NavLinkProps {
  href: string;
  isActive: boolean;
  iconActive: string;
  iconInactive: string;
  children: React.ReactNode;
}

export function NavLink({
  href,
  isActive,
  iconActive,
  iconInactive,
  children,
}: NavLinkProps) {
  return (
    <Link href={href}>
      <Button className="justify-start gap-2 w-full" variant="ghost" size="sm">
        <Icon icon={isActive ? iconActive : iconInactive} fontSize={20} />
        {children}
      </Button>
    </Link>
  );
}
