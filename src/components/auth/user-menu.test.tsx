import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const { signOut, push, refresh } = vi.hoisted(() => ({
  signOut: vi.fn(async () => ({})),
  push: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("@/lib/auth/client", () => ({ authClient: { signOut } }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }));
vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} />,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuItem: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button role="menuitem" {...props} />,
}));
import { UserMenu } from "./user-menu";

describe("UserMenu", () => {
  it("signs out and returns to sign in", async () => {
    const user = userEvent.setup();
    render(<UserMenu user={{ name: "Ada", email: "ada@example.com" }} />);

    await user.click(screen.getByRole("menuitem", { name: /sign out/i }));

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith("/signin");
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});