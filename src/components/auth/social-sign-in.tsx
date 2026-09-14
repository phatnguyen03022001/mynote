"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

type Provider = "google" | "github";

function ProviderMark({ provider }: { provider: Provider }) {
  return <span aria-hidden="true" className="w-5 text-center text-xs font-semibold">{provider === "google" ? "G" : "GH"}</span>;
}

export function SocialSignInButtons() {
  const [pending, setPending] = useState<Provider>();
  const [error, setError] = useState<string>();

  async function signIn(provider: Provider) {
    setPending(provider);
    setError(undefined);
    const result = await authClient.signIn.social({ provider, callbackURL: "/app" });
    if (result?.error) setError("Sign in failed. Try again.");
    setPending(undefined);
  }

  return <div className="grid gap-3">
    {(["google", "github"] as const).map((provider) => <Button key={provider} variant={provider === "google" ? "default" : "outline"} className="w-full" onClick={() => signIn(provider)} disabled={Boolean(pending)}><ProviderMark provider={provider} />Continue with {provider === "google" ? "Google" : "GitHub"}</Button>)}
    {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
  </div>;
}