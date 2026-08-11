"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { createClient } from "@/lib/utils/client";
import { safeRedirectPath } from "@/lib/utils/safe-redirect";
function Github({ className }: { className?: string }){
    return(
        <svg
  viewBox="0 0 24 24"
  className={className}
  aria-hidden="true"
  fill="currentColor"
>
  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23A11.5 11.5 0 0 1 12 4.58c1.02 0 2.05.14 3.01.41 2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.82.57A12.01 12.01 0 0 0 24 12C24 5.37 18.63 0 12 0z" />
</svg>
    );
}
export function GithubSignInButton({
  redirectTo,
  className,
}: {
  redirectTo?: string;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);
  const supabase = createClient();
  const safeRedirect = safeRedirectPath(redirectTo, "/dashboard");

  const signInWithProvider = async (provider: "google" | "github") => {
    if (busy) {
      return;
    }

    setBusy(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeRedirect)}`,
        },
      });

      if (error) {
        console.error(`Could not start ${provider} OAuth flow`, error);
        setBusy(false);
      }
    } catch (error) {
      console.error(`Could not start ${provider} OAuth flow`, error);
      setBusy(false);
    }
  };
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className={className}
      disabled={busy}
      aria-busy={busy}
      aria-label="Continue with Github"
      onClick={() => signInWithProvider("github")}
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        <Github className="size-4" />
      )}
      {busy ? "Signing in…" : "Continue with Github"}
    </Button>
  );
}
