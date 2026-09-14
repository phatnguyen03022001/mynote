import { z } from "zod";

export const noteContentSchema = z.string().trim().min(1).max(20_000);

const tagPattern = /(^|[^\p{L}\p{N}_-])#([\p{L}\p{N}_-]{1,32})/gu;
const urlPattern = /https?:\/\/[^\s<>"']+/giu;
const trailingPunctuation = /[),.;:!?\]}]+$/;

export function extractNoteMetadata(content: string) {
  const tags = new Set<string>();
  const urls = new Set<string>();

  for (const match of content.matchAll(tagPattern)) {
    tags.add(match[2].toLocaleLowerCase());
  }

  for (const match of content.matchAll(urlPattern)) {
    const candidate = match[0].replace(trailingPunctuation, "");
    try {
      urls.add(new URL(candidate).toString());
    } catch {
      // Ignore malformed URL-like text.
    }
  }

  return { tags: [...tags], urls: [...urls] };
}