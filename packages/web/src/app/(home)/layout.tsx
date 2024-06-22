import { HomeNavbar } from "@/components/home-navbar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex">
      <HomeNavbar />
      {children}
    </div>
  );
}
