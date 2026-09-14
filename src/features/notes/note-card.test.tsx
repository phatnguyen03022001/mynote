import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NoteCard } from "./note-card";

const note = {
  id: "n1", content: "original", tags: [], urls: [], pinned: false,
  archived: false, deletedAt: null,
  createdAt: "2026-09-15T00:00:00.000Z",
  updatedAt: "2026-09-15T00:00:00.000Z",
};

describe("NoteCard", () => {
  it("autosaves edited content", async () => {
    const onPatch = vi.fn().mockResolvedValue({ ...note, content: "updated" });
    const user = userEvent.setup();
    render(<NoteCard note={note} view="inbox" onPatch={onPatch} />);

    await user.click(screen.getByRole("button", { name: /edit note/i }));
    const editor = screen.getByRole("textbox", { name: /edit note content/i });
    await user.clear(editor);
    await user.type(editor, "updated");

    await waitFor(() => expect(onPatch).toHaveBeenCalledWith("n1", { action: "update", content: "updated" }), { timeout: 1500 });
    await waitFor(() => expect(screen.getByText("Saved")).toBeInTheDocument());
  });
});