import { execFileSync } from "node:child_process";

const mode = process.argv[2];
if (mode !== "pre" && mode !== "post") {
  console.error("Usage: node scripts/verify-publication.mjs <pre|post>");
  process.exit(2);
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

function fail(message) {
  console.error(`publication check failed: ${message}`);
  process.exit(1);
}

const branch = git(["branch", "--show-current"]);
if (branch !== "main") fail(`expected branch main, got ${branch || "detached HEAD"}`);

if (git(["status", "--porcelain"])) fail("working tree is not clean");

const localHead = git(["rev-parse", "HEAD"]);
const remoteLine = git(["ls-remote", "--heads", "origin", "refs/heads/main"]);
const remoteHead = remoteLine.split(/\s+/)[0];
if (!remoteHead) fail("could not resolve origin/main");

if (mode === "pre") {
  const trackingHead = git(["rev-parse", "origin/main"]);
  if (remoteHead !== trackingHead) {
    fail(`origin/main tracking ref is stale: remote=${remoteHead} tracking=${trackingHead}`);
  }

  try {
    execFileSync("git", ["merge-base", "--is-ancestor", remoteHead, localHead], {
      stdio: "ignore",
    });
  } catch {
    fail(`local HEAD ${localHead} does not descend from remote main ${remoteHead}`);
  }

  console.log(`pre-push verified: remote main ${remoteHead}; local HEAD ${localHead}`);
} else {
  if (remoteHead !== localHead) {
    fail(`remote main ${remoteHead} does not equal local HEAD ${localHead}`);
  }
  console.log(`post-push verified: origin/main == local HEAD == ${localHead}`);
}
