import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-16 sm:px-10">
      <div className="absolute right-6 top-6 sm:right-10 sm:top-10"><ThemeToggle /></div>

      <div className="max-w-2xl space-y-6">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Personal inbox</p>
        <h1 className="text-5xl font-semibold tracking-[-0.05em] sm:text-7xl">MyNote</h1>
        <p className="text-2xl tracking-tight sm:text-3xl">Capture first. Organize later.</p>
        <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Save thoughts, links, snippets, and code without maintaining a complicated knowledge system.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link href="/signin" className={cn(buttonVariants({ size: "lg" }), "px-4")}>
            Sign in <ArrowRight aria-hidden="true" />
          </Link>
          <span className="text-xs text-muted-foreground">Google or GitHub · private by default</span>
        </div>
      </div>
    </main>
  );
}
