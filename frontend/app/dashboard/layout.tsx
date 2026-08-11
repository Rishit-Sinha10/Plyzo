import Nav from "@/app/components/Nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh">
      <Nav />
      <main className="pt-16">{children}</main>
    </div>
  );
}
