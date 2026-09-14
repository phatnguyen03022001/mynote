import { MongoClient } from "mongodb";
import { getServerEnv } from "@/lib/env/server";

let resources:
  | {
      client: MongoClient;
      db: ReturnType<MongoClient["db"]>;
    }
  | undefined;

export function getMongoResources() {
  if (resources) return resources;

  const env = getServerEnv();
  const client = new MongoClient(env.MONGODB_URI);

  resources = {
    client,
    db: client.db(env.MONGODB_DB_NAME),
  };

  return resources;
}
