import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SocialSignInButtons } from "./social-sign-in";

const { social } = vi.hoisted(() => ({ social: vi.fn() }));
vi.mock("@/lib/auth/client", () => ({
  authClient: { signIn: { social } },
}));

describe("SocialSignInButtons", () => {
  beforeEach(() => social.mockReset());

  it.each(["google", "github"] as const)("starts %s sign in", async (provider) => {
    const user = userEvent.setup();
    render(<SocialSignInButtons />);

    await user.click(screen.getByRole("button", { name: new RegExp(provider, "i") }));
    expect(social).toHaveBeenCalledWith({ provider, callbackURL: "/app" });
  });
});