import { describe, expect, it } from "vitest";
import { createNoteRequestSchema, notePatchSchema, notesQuerySchema } from "./note-api";

describe("note API schemas", () => {
  it("parses supported list filters", () => {
    expect(notesQuerySchema.parse({ view: "archive", q: "  work  " })).toEqual({
      view: "archive",
      q: "work",
    });
  });

  it("rejects an update without changes", () => {
    expect(() => notePatchSchema.parse({ action: "update" })).toThrow();
  });

  it("trims created content", () => {
    expect(createNoteRequestSchema.parse({ content: "  hello  " })).toEqual({ content: "hello" });
  });
});