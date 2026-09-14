import { ZodError } from "zod";
import { getAuth } from "@/lib/auth/server";
import { getMongoResources } from "@/lib/db/mongo";
import { createNoteRequestSchema, notesQuerySchema } from "@/features/notes/note-api";
import { createNote, listNotes } from "@/features/notes/note-repository";

async function userIdFrom(request: Request) {
  const session = await getAuth().api.getSession({ headers: request.headers });
  return session?.user.id ?? null;
}

export async function GET(request: Request) {
  const userId = await userIdFrom(request);
  if (!userId) return Response.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  try {
    const url = new URL(request.url);
    const input = notesQuerySchema.parse({
      view: url.searchParams.get("view") ?? undefined,
      q: url.searchParams.get("q") ?? undefined,
    });
    const { db } = getMongoResources();
    return Response.json(await listNotes(db, { userId, view: input.view, query: input.q }));
  } catch (error) {
    if (error instanceof ZodError) return Response.json({ error: "VALIDATION" }, { status: 400 });
    throw error;
  }
}

export async function POST(request: Request) {
  const userId = await userIdFrom(request);
  if (!userId) return Response.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  try {
    const input = createNoteRequestSchema.parse(await request.json());
    const { db } = getMongoResources();
    return Response.json(await createNote(db, userId, input.content), { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return Response.json({ error: "VALIDATION" }, { status: 400 });
    throw error;
  }
}