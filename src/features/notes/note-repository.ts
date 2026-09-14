import { ObjectId, type Db, type Filter } from "mongodb";
import { extractNoteMetadata, noteContentSchema } from "./note-input";

export type NoteView = "inbox" | "archive" | "trash";

type NoteDocument = {
  _id: ObjectId;
  userId: string;
  content: string;
  tags: string[];
  urls: string[];
  pinned: boolean;
  archived: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type NoteRecord = {
  id: string;
  content: string;
  tags: string[];
  urls: string[];
  pinned: boolean;
  archived: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const collection = (db: Db) => db.collection<NoteDocument>("notes");
const parseId = (id: string) => (ObjectId.isValid(id) ? new ObjectId(id) : null);
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function toRecord(document: NoteDocument): NoteRecord {
  return {
    id: document._id.toHexString(),
    content: document.content,
    tags: document.tags,
    urls: document.urls,
    pinned: document.pinned,
    archived: document.archived,
    deletedAt: document.deletedAt?.toISOString() ?? null,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}

export async function createNote(db: Db, userId: string, rawContent: string) {
  const content = noteContentSchema.parse(rawContent);
  const now = new Date();
  const document: NoteDocument = {
    _id: new ObjectId(),
    userId,
    content,
    ...extractNoteMetadata(content),
    pinned: false,
    archived: false,
    deletedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  await collection(db).insertOne(document);
  return toRecord(document);
}

export async function listNotes(
  db: Db,
  input: { userId: string; view: NoteView; query?: string },
) {
  const filter: Filter<NoteDocument> = { userId: input.userId };
  if (input.view === "inbox") Object.assign(filter, { archived: false, deletedAt: null });
  if (input.view === "archive") Object.assign(filter, { archived: true, deletedAt: null });
  if (input.view === "trash") Object.assign(filter, { deletedAt: { $ne: null } });

  const query = input.query?.trim();
  if (query) {
    const pattern = new RegExp(escapeRegex(query), "i");
    filter.$or = [{ content: pattern }, { tags: pattern }];
  }

  const documents = await collection(db)
    .find(filter)
    .sort({ pinned: -1, createdAt: -1, _id: -1 })
    .limit(100)
    .toArray();
  return documents.map(toRecord);
}

export async function updateNote(
  db: Db,
  input: {
    userId: string;
    noteId: string;
    changes: { content?: string; pinned?: boolean; archived?: boolean };
  },
) {
  const _id = parseId(input.noteId);
  if (!_id) return null;

  const changes: Partial<NoteDocument> = { updatedAt: new Date() };
  if (input.changes.content !== undefined) {
    const content = noteContentSchema.parse(input.changes.content);
    Object.assign(changes, { content, ...extractNoteMetadata(content) });
  }
  if (input.changes.pinned !== undefined) changes.pinned = input.changes.pinned;
  if (input.changes.archived !== undefined) changes.archived = input.changes.archived;

  const document = await collection(db).findOneAndUpdate(
    { _id, userId: input.userId, deletedAt: null },
    { $set: changes },
    { returnDocument: "after" },
  );
  return document ? toRecord(document) : null;
}

export async function moveNoteToTrash(db: Db, userId: string, noteId: string) {
  const _id = parseId(noteId);
  if (!_id) return null;

  const now = new Date();
  const document = await collection(db).findOneAndUpdate(
    { _id, userId, deletedAt: null },
    { $set: { deletedAt: now, updatedAt: now } },
    { returnDocument: "after" },
  );
  return document ? toRecord(document) : null;
}

export async function restoreNote(db: Db, userId: string, noteId: string) {
  const _id = parseId(noteId);
  if (!_id) return null;

  const document = await collection(db).findOneAndUpdate(
    { _id, userId, deletedAt: { $ne: null } },
    { $set: { deletedAt: null, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  return document ? toRecord(document) : null;
}
