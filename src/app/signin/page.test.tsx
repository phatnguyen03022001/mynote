import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth/client", () => ({
  authClient: { signIn: { social: vi.fn() } },
}));

import SignInPage from "./page";

describe("SignInPage", () => {
  it("offers Google and GitHub sign in", () => {
    render(<SignInPage />);
    expect(screen.getByRole("heading", { name: /sign in to mynote/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /github/i })).toBeInTheDocument();
  });
});
