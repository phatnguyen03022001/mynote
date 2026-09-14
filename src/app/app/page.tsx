import { redirect } from "next/navigation";
import { AppProviders } from "@/components/providers/app-providers";
import { NotesWorkspace } from "@/features/notes/notes-workspace";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AppPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");

  return (
    <AppProviders>
      <NotesWorkspace user={{ name: user.name, email: user.email }} />
    </AppProviders>
  );
}