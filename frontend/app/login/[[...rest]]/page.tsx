import { LoginForm } from "@/app/components/login-form";
import { safeRedirectPath } from "@/lib/utils/safe-redirect";
import { createClient } from "@/lib/utils/server";
import { redirect } from "next/navigation";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}){ 
    const { from } = await searchParams;
    const safeFrom = safeRedirectPath(from);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect(safeFrom);
    }

    return(
        <div className="min-h-svh w-full bg-background lg:grid lg:grid-cols-2">
  {/* Left — Login */}
  <div className="flex min-h-svh items-center justify-center px-6 py-12 md:px-10">
    <div className="w-full max-w-sm">
      <LoginForm from={safeFrom} />
    </div>
  </div>

  {/* Right — Image */}
  <div className="relative hidden min-h-svh overflow-hidden lg:block">
    <img
      src="/login-image.png"
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
    />

    {/* Subtle overlay */}
    <div className="absolute inset-0 bg-black/10" />

    {/* Optional brand/content */}
    <div className="absolute inset-x-0 bottom-0 p-10 text-white">
      <p className="max-w-md text-lg font-medium leading-relaxed">
        A better way to discover, create, and connect.
      </p>
    </div>
  </div>
</div>
    );
} 