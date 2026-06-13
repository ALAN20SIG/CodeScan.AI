import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EXT_TO_LANG: Record<string, string> = {
  js: "JavaScript",
  jsx: "JavaScript",
  mjs: "JavaScript",
  cjs: "JavaScript",
  ts: "TypeScript",
  tsx: "TypeScript",
  py: "Python",
  go: "Go",
  rs: "Rust",
  java: "Java",
  cpp: "C++",
  cc: "C++",
  cxx: "C++",
  hpp: "C++",
  h: "C++",
};

const inputSchema = z.object({
  url: z.string().trim().min(1).max(2048),
});

/**
 * Convert a github.com blob URL (or an already-raw URL) into a
 * raw.githubusercontent.com URL.
 * e.g. https://github.com/owner/repo/blob/main/src/app.js
 *   -> https://raw.githubusercontent.com/owner/repo/main/src/app.js
 */
function toRawUrl(input: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(input);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;

  if (parsed.hostname === "raw.githubusercontent.com") {
    return parsed.toString();
  }
  if (parsed.hostname === "github.com" || parsed.hostname === "www.github.com") {
    const parts = parsed.pathname.split("/").filter(Boolean);
    // owner / repo / blob|raw / ref / ...path
    const marker = parts[2];
    if (parts.length >= 5 && (marker === "blob" || marker === "raw")) {
      const owner = parts[0];
      const repo = parts[1];
      const ref = parts[3];
      const path = parts.slice(4).join("/");
      return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`;
    }
    return null;
  }
  return null;
}

function langFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_LANG[ext] ?? "Other";
}

export const fetchGithubFile = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const rawUrl = toRawUrl(data.url);
    if (!rawUrl) {
      throw new Error(
        "Enter a valid public GitHub file URL (e.g. https://github.com/owner/repo/blob/main/file.js).",
      );
    }

    let res: Response;
    try {
      res = await fetch(rawUrl, { headers: { "User-Agent": "CodeScan-AI" } });
    } catch {
      throw new Error("Could not reach GitHub. Check the URL and try again.");
    }

    if (res.status === 404) {
      throw new Error("File not found. Make sure the repo and path are public and correct.");
    }
    if (!res.ok) {
      throw new Error(`GitHub returned an error (${res.status}).`);
    }

    const code = await res.text();
    if (code.length > 100_000) {
      throw new Error("File is too large to review (over 100KB).");
    }
    if (!code.trim()) {
      throw new Error("That file appears to be empty.");
    }

    return { code, language: langFromPath(rawUrl) };
  });