import { redirect } from "next/navigation";
import { createClient } from "@/lib/utils/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?from=/dashboard");
  }

  return <div>Dashboard</div>;
}
