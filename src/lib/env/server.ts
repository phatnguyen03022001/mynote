import { z } from "zod";

const mongoUri = z
  .string()
  .min(1)
  .refine((value) => /^mongodb(?:\+srv)?:\/\//.test(value), {
    message: "MONGODB_URI must be a MongoDB connection string",
  });

const optionalSecret = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const serverEnvSchema = z
  .object({
    MONGODB_URI: mongoUri,
    MONGODB_DB_NAME: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    GOOGLE_CLIENT_ID: optionalSecret,
    GOOGLE_CLIENT_SECRET: optionalSecret,
    GITHUB_CLIENT_ID: optionalSecret,
    GITHUB_CLIENT_SECRET: optionalSecret,
  })
  .superRefine((env, context) => {
    requirePair(env, context, "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET");
    requirePair(env, context, "GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET");
  });
type ServerEnv = z.infer<typeof serverEnvSchema>;
type OAuthKey =
  | "GOOGLE_CLIENT_ID"
  | "GOOGLE_CLIENT_SECRET"
  | "GITHUB_CLIENT_ID"
  | "GITHUB_CLIENT_SECRET";

function requirePair(
  env: ServerEnv,
  context: z.RefinementCtx,
  first: OAuthKey,
  second: OAuthKey,
) {
  if (Boolean(env[first]) === Boolean(env[second])) return;

  const missing = env[first] ? second : first;
  context.addIssue({
    code: "custom",
    path: [missing],
    message: `${missing} is required when its OAuth pair is configured`,
  });
}

export function parseServerEnv(
  env: Record<string, string | undefined>,
): ServerEnv {
  return serverEnvSchema.parse(env);
}

let cachedEnv: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  cachedEnv ??= parseServerEnv(process.env);
  return cachedEnv;
}
