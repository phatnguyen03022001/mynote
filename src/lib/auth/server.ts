import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { buildSocialProviders } from "@/lib/auth/providers";
import { getMongoResources } from "@/lib/db/mongo";
import { getServerEnv } from "@/lib/env/server";

function createAuth() {
  const env = getServerEnv();
  const { client, db } = getMongoResources();

  return betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    database: mongodbAdapter(db, { client }),
    socialProviders: buildSocialProviders(env),
  });
}

type AuthInstance = ReturnType<typeof createAuth>;
let auth: AuthInstance | undefined;

export function getAuth(): AuthInstance {
  auth ??= createAuth();
  return auth;
}
