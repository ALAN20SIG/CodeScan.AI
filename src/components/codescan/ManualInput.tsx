import { useState } from "react";
import { LANGUAGES } from "@/lib/codescan-types";
import { useServerFn } from "@tanstack/react-start";
import { fetchGithubFile } from "@/lib/github.functions";

const SAMPLE = `function getUser(req, db) {
  const id = req.query.id;
  const result = db.query("SELECT * FROM users WHERE id = " + id);
  return result;
}`;

export function ManualInput({
  onSubmit,
  onRepoSubmit,
  error,
}: {
  onSubmit: (code: string, language: string) => void;
  onRepoSubmit: (url: string, branch: string) => void;
  error?: string | null;
}) {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<string>("JavaScript");
  const [ghUrl, setGhUrl] = useState("");
  const [ghError, setGhError] = useState<string | null>(null);
  const [ghLoading, setGhLoading] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [repoBranch, setRepoBranch] = useState("");
  const getGithubFile = useServerFn(fetchGithubFile);

  const handleFetch = async () => {
    if (!ghUrl.trim() || ghLoading) return;
    setGhError(null);
    setGhLoading(true);
    try {
      const res = await getGithubFile({ data: { url: ghUrl.trim() } });
      setCode(res.code);
      if (LANGUAGES.includes(res.language as (typeof LANGUAGES)[number])) {
        setLanguage(res.language);
      }
    } catch (e) {
      setGhError(e instanceof Error ? e.message : "Failed to fetch file.");
    } finally {
      setGhLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-3 px-3 py-3">
      <p className="text-xs text-cs-muted">
        Paste code to get an AI-powered review with bugs, security, quality, and
        suggestions.
      </p>
      <div className="flex flex-col gap-1.5 rounded-lg border border-cs-border bg-cs-surface p-2.5">
        <label className="text-[11px] font-medium text-cs-muted">
          Review an entire public GitHub repo
        </label>
        <input
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          spellCheck={false}
          className="min-w-0 rounded-md border border-cs-border bg-cs-surface-2 px-2 py-2 font-mono text-[11px] text-cs-text outline-none placeholder:text-cs-muted focus:border-cs-info"
        />
        <div className="flex items-center gap-2">
          <input
            value={repoBranch}
            onChange={(e) => setRepoBranch(e.target.value)}
            placeholder="branch (default)"
            spellCheck={false}
            className="min-w-0 flex-1 rounded-md border border-cs-border bg-cs-surface-2 px-2 py-2 font-mono text-[11px] text-cs-text outline-none placeholder:text-cs-muted focus:border-cs-info"
          />
          <button
            type="button"
            onClick={() => repoUrl.trim() && onRepoSubmit(repoUrl.trim(), repoBranch.trim())}
            disabled={!repoUrl.trim()}
            className="shrink-0 rounded-md bg-cs-info px-3 py-2 text-xs font-bold text-cs-bg transition-colors hover:bg-cs-info/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Scan repo
          </button>
        </div>
        <p className="text-[10px] text-cs-muted">
          Maps the file tree and deep-reviews key source files.
        </p>
      </div>
      <div className="flex flex-col gap-1.5 rounded-lg border border-cs-border bg-cs-surface p-2.5">
        <label className="text-[11px] font-medium text-cs-muted">
          Review from a public GitHub file
        </label>
        <div className="flex items-center gap-2">
          <input
            value={ghUrl}
            onChange={(e) => setGhUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleFetch();
            }}
            placeholder="https://github.com/owner/repo/blob/main/file.js"
            spellCheck={false}
            className="min-w-0 flex-1 rounded-md border border-cs-border bg-cs-surface-2 px-2 py-2 font-mono text-[11px] text-cs-text outline-none placeholder:text-cs-muted focus:border-cs-info"
          />
          <button
            type="button"
            onClick={handleFetch}
            disabled={!ghUrl.trim() || ghLoading}
            className="shrink-0 rounded-md border border-cs-border bg-cs-surface-2 px-2.5 py-2 text-xs text-cs-text transition-colors hover:border-cs-info disabled:cursor-not-allowed disabled:opacity-40"
          >
            {ghLoading ? "Fetching…" : "Fetch"}
          </button>
        </div>
        {ghError && <p className="text-[11px] text-cs-critical">{ghError}</p>}
      </div>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="// Paste your code here..."
        spellCheck={false}
        className="min-h-48 flex-1 resize-none rounded-lg border border-cs-border bg-cs-surface p-3 font-mono text-xs text-cs-text outline-none placeholder:text-cs-muted focus:border-cs-info"
      />
      {error && (
        <p className="rounded-md border border-cs-critical/30 bg-cs-critical/10 px-2 py-1.5 text-xs text-cs-critical">
          {error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-md border border-cs-border bg-cs-surface-2 px-2 py-2 text-xs text-cs-text outline-none focus:border-cs-info"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setCode(SAMPLE)}
          className="rounded-md border border-cs-border bg-cs-surface-2 px-2 py-2 text-xs text-cs-muted transition-colors hover:text-cs-text"
        >
          Sample
        </button>
      </div>
      <button
        onClick={() => onSubmit(code, language)}
        disabled={!code.trim()}
        className="rounded-md bg-cs-info px-3 py-2.5 text-sm font-bold text-cs-bg transition-colors hover:bg-cs-info/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Review Code
      </button>
    </div>
  );
}