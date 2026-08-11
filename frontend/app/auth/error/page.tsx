import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold">Sign in failed</h1>
      <p className="max-w-md text-sm text-muted">
        We couldn&apos;t complete the sign-in.
        {reason ? (
          <>
            {" "}
            <span className="text-muted-foreground">({reason})</span>
          </>
        ) : null}{" "}
        Please try again.
      </p>
      <Button asChild>
        <Link href="/login">Back to login</Link>
      </Button>
    </div>
  );
}
