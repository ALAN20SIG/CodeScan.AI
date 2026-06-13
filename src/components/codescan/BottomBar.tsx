export function BottomBar({
  onReviewAgain,
  onCopy,
  copied,
}: {
  onReviewAgain: () => void;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="sticky bottom-0 grid grid-cols-2 gap-2 border-t border-cs-border bg-cs-bg px-3 py-2.5">
      <button
        onClick={onReviewAgain}
        className="rounded-md border border-cs-border bg-cs-surface-2 px-3 py-2 text-xs font-semibold text-cs-text transition-colors hover:bg-cs-surface"
      >
        Review again
      </button>
      <button
        onClick={onCopy}
        className="rounded-md bg-cs-info px-3 py-2 text-xs font-semibold text-cs-bg transition-colors hover:bg-cs-info/90"
      >
        {copied ? "Copied!" : "Copy report"}
      </button>
    </div>
  );
}