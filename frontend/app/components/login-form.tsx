import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { GoogleSignInButton } from "@/app/components/ui/google-button";
import { GithubSignInButton } from "./ui/github-button";
import { FormField, Textarea } from "./ui/textarea";
export function LoginForm({
  from,
  className,
  ...props
}: React.ComponentProps<"div"> & { from?: string }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <h2 className=" flex justify-center font-display text-[22px] leading-none tracking-tight text-foreground">
          Plyzo
        </h2>
        <CardHeader>
          <CardTitle className="flex justify-center">
            Login to your account
          </CardTitle>
          <CardDescription>
            Continue with Google to access your feed.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <FormField ></FormField>
          <GoogleSignInButton redirectTo={from} className="w-full" />
          <GithubSignInButton redirectTo={from} className="w-full"/>
          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to Plyzo&apos;s terms and privacy policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
