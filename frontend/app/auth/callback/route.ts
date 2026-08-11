// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/utils/server";
import { safeRedirectPath } from "@/lib/utils/safe-redirect";
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"), "/dashboard");
  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error?reason=missing_code`);
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/auth/error?reason=exchange_failed`);
  }
  return NextResponse.redirect(`${origin}${next}`);
}