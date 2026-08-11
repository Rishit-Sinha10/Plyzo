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
  return (
    <>
    <div className="flex items-center justify-center min-h-screen">
       <p className="enter mt-2 max-w-xl text-balance text-[16px] leading-relaxed text-muted drop-shadow-[0_1px_1px_rgba(250,250,251,0.5)] dark:drop-shadow-[0_1px_2px_rgba(12,12,15,0.9)] sm:text-base">Dashboard Comming Soon!</p>
    </div>
    </>
  );
}
