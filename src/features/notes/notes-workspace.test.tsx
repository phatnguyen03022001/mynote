import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NotesWorkspace } from "./notes-workspace";

vi.mock("@/components/auth/user-menu", () => ({
  UserMenu: () => <div data-testid="user-menu" />,
}));
vi.mock("@/components/theme/theme-toggle", () => ({
  ThemeToggle: () => <button type="button">Theme</button>,
}));

const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; });

describe("NotesWorkspace", () => {
  it("captures a note and shows it in the inbox", async () => {
    const note = { id: "n1", content: "hello #work", tags: ["work"], urls: [], pinned: false, archived: false, deletedAt: null, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    let notes: typeof note[] = [];
    global.fetch = vi.fn(async (input, init) => {
      const url = String(input);
      if (init?.method === "POST") { notes = [note]; return Response.json(note, { status: 201 }); }
      if (url.startsWith("/api/notes")) return Response.json(notes);
      throw new Error(`unexpected fetch ${url}`);
    }) as typeof fetch;

    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><NotesWorkspace user={{ name: "Phat", email: "p@example.com" }} /></QueryClientProvider>);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/capture/i), "hello #work");
    await user.click(screen.getByRole("button", { name: /save note/i }));

    await waitFor(() => expect(screen.getByText("hello #work")).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith("/api/notes", expect.objectContaining({ method: "POST" }));
  });
});
