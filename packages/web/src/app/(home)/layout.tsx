import { HomeNavbar } from "@/components/home-navbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full justify-center gap-x-3">
      <header>
        <HomeNavbar />
      </header>
      <main>{children}</main>
    </div>
  );
}
