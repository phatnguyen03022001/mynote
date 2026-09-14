// @vitest-environment node

import { randomUUID } from "node:crypto";
import { MongoClient, type Db } from "mongodb";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
  createNote,
  listNotes,
  moveNoteToTrash,
  restoreNote,
  updateNote,
} from "./note-repository";

const client = new MongoClient(process.env.TEST_MONGODB_URI ?? "mongodb://127.0.0.1:27017");
let db: Db;

beforeAll(async () => {
  await client.connect();
  db = client.db(`mynote_test_${randomUUID().replaceAll("-", "")}`);
});

afterAll(async () => {
  await db.dropDatabase();
  await client.close();
});

describe("note repository ownership", () => {
  it("isolates reads and mutations by userId", async () => {
    const note = await createNote(db, "user-a", "Keep this #Work https://example.com");

    expect(await listNotes(db, { userId: "user-a", view: "inbox" })).toHaveLength(1);
    expect(await listNotes(db, { userId: "user-b", view: "inbox" })).toEqual([]);
    expect(await updateNote(db, {
      userId: "user-b",
      noteId: note.id,
      changes: { pinned: true },
    })).toBeNull();
    expect(await moveNoteToTrash(db, "user-b", note.id)).toBeNull();

    const ownerView = await listNotes(db, { userId: "user-a", view: "inbox" });
    expect(ownerView[0]).toMatchObject({ pinned: false, content: "Keep this #Work https://example.com" });
  });

  it("supports search, archive, trash, and restore for the owner", async () => {
    const first = await createNote(db, "user-c", "Alpha #Project");
    await createNote(db, "user-c", "Beta #Todo");

    const search = await listNotes(db, { userId: "user-c", view: "inbox", query: "project" });
    expect(search.map((note) => note.id)).toEqual([first.id]);

    await updateNote(db, {
      userId: "user-c",
      noteId: first.id,
      changes: { archived: true },
    });
    expect((await listNotes(db, { userId: "user-c", view: "archive" }))[0]?.id).toBe(first.id);

    await moveNoteToTrash(db, "user-c", first.id);
    expect((await listNotes(db, { userId: "user-c", view: "trash" }))[0]?.id).toBe(first.id);
    await restoreNote(db, "user-c", first.id);
    expect((await listNotes(db, { userId: "user-c", view: "archive" }))[0]?.id).toBe(first.id);
  });
});