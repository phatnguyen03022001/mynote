// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSession, updateNote, moveNoteToTrash, restoreNote } = vi.hoisted(() => ({
  getSession: vi.fn(), updateNote: vi.fn(), moveNoteToTrash: vi.fn(), restoreNote: vi.fn(),
}));

vi.mock("@/lib/auth/server", () => ({ getAuth: () => ({ api: { getSession } }) }));
vi.mock("@/lib/db/mongo", () => ({ getMongoResources: () => ({ db: {} }) }));
vi.mock("@/features/notes/note-repository", () => ({ updateNote, moveNoteToTrash, restoreNote }));

import { PATCH } from "./route";

describe("note mutation route", () => {
  beforeEach(() => {
    getSession.mockReset(); updateNote.mockReset(); moveNoteToTrash.mockReset(); restoreNote.mockReset();
  });

  it("rejects unauthenticated mutations", async () => {
    getSession.mockResolvedValue(null);
    const response = await PATCH(new Request("http://localhost/api/notes/n1", { method: "PATCH" }), { params: Promise.resolve({ id: "n1" }) });
    expect(response.status).toBe(401);
  });

  it("trashes only as the authenticated user", async () => {
    getSession.mockResolvedValue({ user: { id: "server-user" } });
    moveNoteToTrash.mockResolvedValue({ id: "n1" });
    const request = new Request("http://localhost/api/notes/n1", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "trash" }) });
    const response = await PATCH(request, { params: Promise.resolve({ id: "n1" }) });
    expect(response.status).toBe(200);
    expect(moveNoteToTrash).toHaveBeenCalledWith({}, "server-user", "n1");
  });
});
