import { NavLink } from "./nav-link";

interface SessionData {
  user: {
    username: string;
  };
}

interface ProfileLinkProps {
  session: SessionData;
  pathname: string;
}

export function ProfileLink({ session, pathname }: ProfileLinkProps) {
  const username = session.user.username;
  return (
    <NavLink
      href={`/users/${username}`}
      isActive={pathname === `/users/${username}`}
      iconActive="bxs:user"
      iconInactive="bx:user"
    >
      Profile
    </NavLink>
  );
}
