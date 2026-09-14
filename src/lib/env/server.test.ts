import { describe, expect, it } from "vitest";
import { parseServerEnv } from "./server";

const baseEnv = {
  MONGODB_URI: "mongodb://localhost:27017/mynote",
  MONGODB_DB_NAME: "mynote",
  BETTER_AUTH_SECRET: "12345678901234567890123456789012",
  BETTER_AUTH_URL: "http://localhost:3000",
};

describe("parseServerEnv", () => {
  it("accepts the minimum server configuration", () => {
    expect(parseServerEnv(baseEnv)).toMatchObject(baseEnv);
  });

  it("rejects a partial Google OAuth configuration", () => {
    expect(() =>
      parseServerEnv({ ...baseEnv, GOOGLE_CLIENT_ID: "client-id" }),
    ).toThrow(/GOOGLE_CLIENT_SECRET/);
  });

  it("rejects non-MongoDB connection strings", () => {
    expect(() =>
      parseServerEnv({ ...baseEnv, MONGODB_URI: "https://example.com" }),
    ).toThrow(/MONGODB_URI/);
  });
});

describe("optional OAuth environment variables", () => {
  it("treats empty provider values as unset", () => {
    const parsed = parseServerEnv({
      ...baseEnv,
      GOOGLE_CLIENT_ID: "",
      GOOGLE_CLIENT_SECRET: "",
    });

    expect(parsed.GOOGLE_CLIENT_ID).toBeUndefined();
    expect(parsed.GOOGLE_CLIENT_SECRET).toBeUndefined();
  });
});
