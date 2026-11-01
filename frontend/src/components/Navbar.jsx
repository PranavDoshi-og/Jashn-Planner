import { useState, memo } from "react";
import { PrinterIcon, DownloadIcon, CopyIcon, CheckIcon } from "./Icons";

export const Navbar = memo(function Navbar({ plan, onPrint, onExport }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!plan) return;
    const text = `🎉 Jashn Event Plan: ${plan.summary}\n\nBudget categories: ${plan.budget.map((b) => `${b.category} (${b.percent}% - ${b.amount})`).join(", ")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md no-print">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-marigold to-rose text-white shadow-sm font-bold text-lg">
            <span>ज</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl font-black tracking-tight text-ink">Jashn</span>
              <span className="rounded-full bg-marigold-light px-2.5 py-0.5 text-xs font-semibold text-ink border border-marigold/30">
                AI Event Architect
              </span>
            </div>
            <p className="text-xs text-ink-muted hidden sm:block">
              Structured celebration planning for weddings, birthdays & community festivals
            </p>
          </div>
        </div>

        {plan && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-mist transition-colors focus-visible:ring-2 focus-visible:ring-rose"
              title="Copy event plan summary"
              aria-label="Copy event plan summary"
            >
              {copied ? <CheckIcon className="w-3.5 h-3.5 text-teal" /> : <CopyIcon className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              onClick={onExport}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-mist transition-colors focus-visible:ring-2 focus-visible:ring-rose"
              title="Download Plan as JSON"
              aria-label="Download Plan as JSON"
            >
              <DownloadIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Export</span>
            </button>
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose text-white px-3.5 py-1.5 text-xs font-medium hover:bg-rose-hover shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-rose"
              title="Print Day-of Run Sheet & Blueprint"
              aria-label="Print Day-of Run Sheet and Complete Blueprint"
            >
              <PrinterIcon className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
});

