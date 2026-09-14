// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSession, createNote, listNotes } = vi.hoisted(() => ({
  getSession: vi.fn(),
  createNote: vi.fn(),
  listNotes: vi.fn(),
}));

vi.mock("@/lib/auth/server", () => ({ getAuth: () => ({ api: { getSession } }) }));
vi.mock("@/lib/db/mongo", () => ({ getMongoResources: () => ({ db: {} }) }));
vi.mock("@/features/notes/note-repository", () => ({ createNote, listNotes }));

import { GET, POST } from "./route";

describe("notes route", () => {
  beforeEach(() => {
    getSession.mockReset();
    createNote.mockReset();
    listNotes.mockReset();
  });

  it("rejects unauthenticated reads", async () => {
    getSession.mockResolvedValue(null);
    const response = await GET(new Request("http://localhost/api/notes"));
    expect(response.status).toBe(401);
  });

  it("creates notes for the authenticated user", async () => {
    getSession.mockResolvedValue({ user: { id: "server-user" } });
    createNote.mockResolvedValue({ id: "n1", content: "hello" });
    const request = new Request("http://localhost/api/notes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ content: "hello", userId: "attacker" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
    expect(createNote).toHaveBeenCalledWith({}, "server-user", "hello");
  });
});
