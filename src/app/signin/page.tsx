import { SocialSignInButtons } from "@/components/auth/social-sign-in";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-16">
      <div className="absolute right-6 top-6"><ThemeToggle /></div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">MyNote</p>
          <CardTitle><h1 className="text-2xl">Sign in to MyNote</h1></CardTitle>
          <CardDescription>Private notes, links, snippets, and code. No folders to maintain.</CardDescription>
        </CardHeader>
        <CardContent>
          <SocialSignInButtons />
          <p className="mt-4 text-xs leading-5 text-muted-foreground">By continuing, you use your Google or GitHub identity only for authentication. Notes remain private to your account.</p>
        </CardContent>
      </Card>
    </main>
  );
}