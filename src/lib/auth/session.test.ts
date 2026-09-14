import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentUser } from "./session";

const { getSession, headersValue } = vi.hoisted(() => ({
  getSession: vi.fn(),
  headersValue: new Headers({ cookie: "session=test" }),
}));

vi.mock("next/headers", () => ({ headers: vi.fn(async () => headersValue) }));
vi.mock("./server", () => ({ getAuth: () => ({ api: { getSession } }) }));

describe("getCurrentUser", () => {
  beforeEach(() => getSession.mockReset());

  it("returns the authenticated Better Auth user", async () => {
    const user = { id: "user-1", name: "Ada", email: "ada@example.com" };
    getSession.mockResolvedValue({ user, session: { id: "session-1" } });

    await expect(getCurrentUser()).resolves.toEqual(user);
    expect(getSession).toHaveBeenCalledWith({ headers: headersValue });
  });

  it("returns null when the request has no session", async () => {
    getSession.mockResolvedValue(null);
    await expect(getCurrentUser()).resolves.toBeNull();
  });
});