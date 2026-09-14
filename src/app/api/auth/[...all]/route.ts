import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth/server";

function getHandlers() {
  return toNextJsHandler(getAuth());
}

export async function GET(request: Request) {
  return getHandlers().GET(request);
}

export async function POST(request: Request) {
  return getHandlers().POST(request);
}
