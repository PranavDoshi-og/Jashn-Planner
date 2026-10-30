import { SparklesIcon } from "../Icons";

export function IdeasTab({ ideas }) {
  const themeAccents = [
    { border: "border-marigold", bg: "bg-marigold-light/20", tag: "Theme 1", badgeColor: "bg-marigold text-ink" },
    { border: "border-rose", bg: "bg-rose-light/20", tag: "Theme 2", badgeColor: "bg-rose text-white" },
    { border: "border-teal", bg: "bg-teal-light/20", tag: "Theme 3", badgeColor: "bg-teal text-white" },
  ];

  return (
    <div className="space-y-6">
      {/* 3 Creative Themes */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink">
            Aesthetic Themes & Creative Direction
          </h3>
          <span className="text-xs text-ink-muted">Tailored to culture, vibe & venue</span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {ideas.themes.map((t, idx) => {
            const styling = themeAccents[idx % themeAccents.length];
            return (
              <div
                key={t.title}
                className={`rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:shadow-md flex flex-col justify-between border-t-4 ${styling.border}`}
              >
                <div>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold mb-2 ${styling.badgeColor}`}>
                    {styling.tag}
                  </span>
                  <h4 className="font-display text-lg font-bold text-ink">
                    {t.title}
                  </h4>
                  <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                    {t.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu & Activities Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Menu Section */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-marigold-light text-ink font-bold text-xs">
              🍽️
            </span>
            <div>
              <h4 className="font-display text-base font-bold text-ink">
                Culinary Experience & Curated Menu
              </h4>
              <p className="text-[11px] text-ink-muted">Culturally attuned flavors & dietary choices</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {ideas.menu.map((dish, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-lg border border-border/50 bg-mist/40 p-2.5 text-xs text-ink"
              >
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-rose shrink-0" />
                <span className="font-medium leading-relaxed">{dish}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activities Section */}
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3 mb-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-light text-teal font-bold text-xs">
              🎉
            </span>
            <div>
              <h4 className="font-display text-base font-bold text-ink">
                Guest Experience & Activities
              </h4>
              <p className="text-[11px] text-ink-muted">High-engagement rituals, games & entertainment</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {ideas.activities.map((act, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-lg border border-border/50 bg-mist/40 p-2.5 text-xs text-ink"
              >
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-teal shrink-0" />
                <span className="font-medium leading-relaxed">{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
