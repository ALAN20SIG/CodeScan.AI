import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PipelineResult, PipelineStage, StageStatus } from "@/lib/codescan-types";

function buildReport(result: PipelineResult): string {
  const lines: string[] = [];
  lines.push(`CodeScan AI — CI/CD Pipeline Run`);
  lines.push(`Language:  ${result.language}`);
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push("");
  lines.push(`Result: ${result.success ? "SUCCESS" : "FAILED"}  |  CI grade: ${result.grade}`);
  lines.push(`Passed: ${result.passed}  Failed: ${result.failed}  Skipped: ${result.skipped}`);
  if (result.verdict) lines.push(`Verdict: ${result.verdict}`);
  lines.push("");
  result.stages.forEach((s, i) => {
    lines.push(`${i + 1}. [${s.status.toUpperCase()}] ${s.label} (${s.durationSec}s)`);
    if (s.summary) lines.push(`     ${s.summary}`);
    s.logs.forEach((l) => lines.push(`       ${l}`));
    s.issues.forEach((iss) => lines.push(`       ! ${iss}`));
  });
  return lines.join("\n");
}

function saveResults(result: PipelineResult) {
  const blob = new Blob([buildReport(result)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ci-pipeline-run-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function statusStyle(status: StageStatus): { dot: string; text: string; label: string } {
  if (status === "passed")
    return { dot: "bg-cs-success/15 text-cs-success", text: "text-cs-success", label: "✓" };
  if (status === "failed")
    return { dot: "bg-cs-critical/15 text-cs-critical", text: "text-cs-critical", label: "✕" };
  return { dot: "bg-cs-surface-2 text-cs-muted", text: "text-cs-muted", label: "–" };
}

function StageRow({ stage, index, last }: { stage: PipelineStage; index: number; last: boolean }) {
  const [open, setOpen] = useState(stage.status === "failed");
  const s = statusStyle(stage.status);
  return (
    <div className="relative pl-8">
      {!last && <span className="absolute left-[14px] top-7 h-[calc(100%-12px)] w-px bg-cs-border" />}
      <span
        className={`absolute left-0 top-1 grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${s.dot}`}
      >
        {s.label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 pb-1 text-left"
      >
        <span className="flex items-center gap-2">
          <span className="text-sm font-bold text-cs-text">
            {index + 1}. {stage.label}
          </span>
          <span className={`text-xs font-bold uppercase ${s.text}`}>{stage.status}</span>
        </span>
        <span className="font-mono text-xs text-cs-muted">{stage.durationSec}s</span>
      </button>
      {stage.summary && <p className="text-xs leading-relaxed text-cs-muted">{stage.summary}</p>}
      {open && (stage.logs.length > 0 || stage.issues.length > 0) && (
        <div className="mt-2 space-y-2 pb-3">
          {stage.logs.length > 0 && (
            <pre className="overflow-auto rounded-md border border-cs-border bg-cs-bg p-3 font-mono text-xs leading-relaxed text-cs-muted">
              {stage.logs.join("\n")}
            </pre>
          )}
          {stage.issues.map((iss, i) => (
            <p key={i} className="break-words font-mono text-xs leading-relaxed text-cs-critical/90">
              ! {iss}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function PipelinePanel({
  onRun,
  isPending,
  result,
  error,
  canRun,
}: {
  onRun: () => void;
  isPending: boolean;
  result: PipelineResult | null;
  error: string | null;
  canRun: boolean;
}) {
  return (
    <div className="border-b border-cs-border bg-cs-surface px-4 py-4 md:px-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-cs-text">CI/CD pipeline</p>
          <p className="text-xs text-cs-muted">
            Simulates lint → unit → integration → build → deploy.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {result && (
            <button
              type="button"
              onClick={() => saveResults(result)}
              className="rounded-md border border-cs-border bg-cs-surface-2 px-3 py-2 text-xs font-bold text-cs-text transition-colors hover:bg-cs-bg"
            >
              Save results
            </button>
          )}
          <button
            type="button"
            onClick={onRun}
            disabled={isPending || !canRun}
            className="rounded-md bg-cs-info px-3 py-2 text-xs font-bold text-cs-bg transition-colors hover:bg-cs-info/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isPending ? "Running pipeline…" : result ? "Re-run pipeline" : "Run pipeline"}
          </button>
        </div>
      </div>
      {!canRun && (
        <p className="mt-2 text-xs text-cs-muted">
          Provide code or review a repo first to run the pipeline.
        </p>
      )}
      {error && <p className="mt-2 text-xs text-cs-critical">{error}</p>}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-4">
            <div
              className={`rounded-lg border p-4 ${
                result.success
                  ? "border-cs-success/30 bg-cs-success/5"
                  : "border-cs-critical/30 bg-cs-critical/5"
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-md px-2 py-1 font-mono text-xs font-bold ${
                    result.success
                      ? "bg-cs-success/20 text-cs-success"
                      : "bg-cs-critical/20 text-cs-critical"
                  }`}
                >
                  {result.success ? "PIPELINE PASSED" : "PIPELINE FAILED"}
                </span>
                <span className="rounded-md bg-cs-info/20 px-2 py-1 font-mono text-xs font-bold text-cs-info">
                  CI grade {result.grade}
                </span>
                <span className="rounded-md bg-cs-success/15 px-2 py-1 font-mono text-xs font-bold text-cs-success">
                  {result.passed} passed
                </span>
                <span className="rounded-md bg-cs-critical/15 px-2 py-1 font-mono text-xs font-bold text-cs-critical">
                  {result.failed} failed
                </span>
                <span className="rounded-md bg-cs-surface-2 px-2 py-1 font-mono text-xs text-cs-muted">
                  {result.skipped} skipped
                </span>
              </div>
              {result.verdict && (
                <p className="mt-2 text-sm leading-relaxed text-cs-text">{result.verdict}</p>
              )}
            </div>
            <div className="space-y-1">
              {result.stages.map((stage, i) => (
                <StageRow
                  key={stage.key}
                  stage={stage}
                  index={i}
                  last={i === result.stages.length - 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
