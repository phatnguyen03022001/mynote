import { headers } from "next/headers";
import { getAuth } from "./server";

export async function getCurrentUser() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  return session?.user ?? null;
}
