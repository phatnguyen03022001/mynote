import { describe, expect, it } from "vitest";
import { buildSocialProviders } from "./providers";

describe("buildSocialProviders", () => {
  it("omits providers that are not configured", () => {
    expect(buildSocialProviders({})).toEqual({});
  });

  it("maps configured Google and GitHub credentials", () => {
    expect(
      buildSocialProviders({
        GOOGLE_CLIENT_ID: "google-id",
        GOOGLE_CLIENT_SECRET: "google-secret",
        GITHUB_CLIENT_ID: "github-id",
        GITHUB_CLIENT_SECRET: "github-secret",
      }),
    ).toEqual({
      google: { clientId: "google-id", clientSecret: "google-secret" },
      github: { clientId: "github-id", clientSecret: "github-secret" },
    });
  });
});
