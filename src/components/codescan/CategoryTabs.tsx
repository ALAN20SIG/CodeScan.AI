import { CATEGORIES, type Category, type Finding } from "@/lib/codescan-types";

export type ViewTab = Category | "cicd";

export function CategoryTabs({
  active,
  onChange,
  findings,
  pipelineStatus,
}: {
  active: ViewTab;
  onChange: (c: ViewTab) => void;
  findings: Finding[];
  pipelineStatus?: "passed" | "failed" | null;
}) {
  return (
    <div className="grid grid-cols-5 gap-2 border-b border-cs-border bg-cs-bg px-3 py-3 md:px-6">
      {CATEGORIES.map(({ key, label }) => {
        const count = findings.filter((f) => f.category === key).length;
        const isActive = key === active;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex flex-col items-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-cs-surface-2 text-cs-text"
                : "text-cs-muted hover:text-cs-text"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {label}
              <span
                className={`rounded-full px-2 text-xs font-bold ${
                  count > 0
                    ? "bg-cs-info/20 text-cs-info"
                    : "bg-cs-surface text-cs-muted"
                }`}
              >
                {count}
              </span>
            </span>
            <span
              className={`h-0.5 w-full rounded-full transition-colors ${
                isActive ? "bg-cs-info" : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
      {(() => {
        const isActive = active === "cicd";
        const badge =
          pipelineStatus === "passed"
            ? "bg-cs-success/20 text-cs-success"
            : pipelineStatus === "failed"
              ? "bg-cs-critical/20 text-cs-critical"
              : "bg-cs-surface text-cs-muted";
        return (
          <button
            onClick={() => onChange("cicd")}
            className={`flex flex-col items-center gap-1.5 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-cs-surface-2 text-cs-text" : "text-cs-muted hover:text-cs-text"
            }`}
          >
            <span className="flex items-center gap-1.5">
              CI/CD
              <span className={`rounded-full px-2 text-xs font-bold ${badge}`}>
                {pipelineStatus === "passed" ? "✓" : pipelineStatus === "failed" ? "✕" : "–"}
              </span>
            </span>
            <span
              className={`h-0.5 w-full rounded-full transition-colors ${
                isActive ? "bg-cs-info" : "bg-transparent"
              }`}
            />
          </button>
        );
      })()}
    </div>
  );
}