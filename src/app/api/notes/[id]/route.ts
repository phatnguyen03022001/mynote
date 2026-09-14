import { ZodError } from "zod";
import { notePatchSchema } from "@/features/notes/note-api";
import { moveNoteToTrash, restoreNote, updateNote } from "@/features/notes/note-repository";
import { getAuth } from "@/lib/auth/server";
import { getMongoResources } from "@/lib/db/mongo";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  try {
    const input = notePatchSchema.parse(await request.json());
    const { id } = await context.params;
    const { db } = getMongoResources();
    const userId = session.user.id;

    const note = input.action === "trash"
      ? await moveNoteToTrash(db, userId, id)
      : input.action === "restore"
        ? await restoreNote(db, userId, id)
        : await updateNote(db, { userId, noteId: id, changes: input });

    if (!note) return Response.json({ error: "NOT_FOUND" }, { status: 404 });
    return Response.json(note);
  } catch (error) {
    if (error instanceof ZodError) return Response.json({ error: "VALIDATION" }, { status: 400 });
    throw error;
  }
}