import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { getCurrentUser, redirect } = vi.hoisted(() => ({
  getCurrentUser: vi.fn(),
  redirect: vi.fn(() => { throw new Error("redirect"); }),
}));

vi.mock("@/lib/auth/session", () => ({ getCurrentUser }));
vi.mock("next/navigation", () => ({ redirect }));
vi.mock("@/features/notes/notes-workspace", () => ({
  NotesWorkspace: ({ user }: { user: { email: string } }) => <div>{user.email}</div>,
}));
import AppPage from "./page";

describe("AppPage", () => {
  it("redirects unauthenticated users to sign in", async () => {
    getCurrentUser.mockResolvedValue(null);
    await expect(AppPage()).rejects.toThrow("redirect");
    expect(redirect).toHaveBeenCalledWith("/signin");
  });

  it("renders the workspace for an authenticated user", async () => {
    getCurrentUser.mockResolvedValue({ id: "u1", email: "ada@example.com", name: "Ada" });
    render(await AppPage());
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
  });
});