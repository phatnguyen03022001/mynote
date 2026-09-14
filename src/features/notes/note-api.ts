import { z } from "zod";
import { noteContentSchema } from "./note-input";

export const notesQuerySchema = z.object({
  view: z.enum(["inbox", "archive", "trash"]).default("inbox"),
  q: z.string().trim().max(200).optional(),
});

export const createNoteRequestSchema = z.object({
  content: noteContentSchema,
});

const updateSchema = z
  .object({
    action: z.literal("update"),
    content: noteContentSchema.optional(),
    pinned: z.boolean().optional(),
    archived: z.boolean().optional(),
  })
  .refine((value) => value.content !== undefined || value.pinned !== undefined || value.archived !== undefined, {
    message: "At least one note change is required",
  });

export const notePatchSchema = z.discriminatedUnion("action", [
  updateSchema,
  z.object({ action: z.literal("trash") }),
  z.object({ action: z.literal("restore") }),
]);