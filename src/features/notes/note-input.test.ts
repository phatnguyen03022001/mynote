import { describe, expect, it } from "vitest";
import { extractNoteMetadata, noteContentSchema } from "./note-input";

describe("noteContentSchema", () => {
  it("trims valid note content", () => {
    expect(noteContentSchema.parse("  hello  ")).toBe("hello");
  });

  it("rejects empty notes", () => {
    expect(() => noteContentSchema.parse("   ")).toThrow();
  });
});

describe("extractNoteMetadata", () => {
  it("deduplicates normalized tags and urls", () => {
    expect(extractNoteMetadata("#Work #work read https://example.com and https://example.com")).toEqual({
      tags: ["work"],
      urls: ["https://example.com/"],
    });
  });

  it("ignores malformed urls and punctuation around tags", () => {
    expect(extractNoteMetadata("(#idea), not-a-url example.com")).toEqual({
      tags: ["idea"],
      urls: [],
    });
  });
});