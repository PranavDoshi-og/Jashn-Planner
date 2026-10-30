export function PrintView({ plan, intake, total }) {
  if (!plan || !intake) return null;

  const money = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: intake.currency || "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="hidden print:block text-black p-8 max-w-4xl mx-auto space-y-6">
      {/* Print Header */}
      <div className="border-b-2 border-black pb-4">
        <div className="flex justify-between items-baseline">
          <h1 className="text-3xl font-bold tracking-tight">Jashn Celebration Blueprint</h1>
          <span className="text-sm font-semibold">PromptWars Challenge 5</span>
        </div>
        <p className="text-sm mt-1">Generated: {new Date().toLocaleDateString("en-IN")}</p>
      </div>

      {/* Event Details Grid */}
      <div className="grid grid-cols-3 gap-4 border border-black p-3 text-xs">
        <div><strong>Event:</strong> {intake.event_type}</div>
        <div><strong>Date:</strong> {intake.event_date}</div>
        <div><strong>Location:</strong> {intake.location}</div>
        <div><strong>Guests:</strong> {intake.guests}</div>
        <div><strong>Total Budget:</strong> {money(total)}</div>
        <div><strong>Culture/Tradition:</strong> {intake.culture || "General"}</div>
      </div>

      {/* Summary */}
      <div>
        <h2 className="text-lg font-bold border-b border-black pb-1 mb-2">Executive Summary</h2>
        <p className="text-sm leading-relaxed">{plan.summary}</p>
      </div>

      {/* Budget Breakdown */}
      <div className="print-break-inside-avoid">
        <h2 className="text-lg font-bold border-b border-black pb-1 mb-2">Budget Allocation</h2>
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-black">
              <th className="py-1">Category</th>
              <th className="py-1">Percentage</th>
              <th className="py-1">Planned Amount</th>
              <th className="py-1">Strategic Allocation Note</th>
            </tr>
          </thead>
          <tbody>
            {plan.budget.map((b) => (
              <tr key={b.category} className="border-b border-gray-300">
                <td className="py-1 font-semibold">{b.category}</td>
                <td className="py-1">{b.percent}%</td>
                <td className="py-1 font-mono">{money(Math.round((total * b.percent) / 100))}</td>
                <td className="py-1">{b.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Backward Timeline & Day-of Run Sheet */}
      <div className="print-page-break print-break-inside-avoid">
        <h2 className="text-lg font-bold border-b border-black pb-1 mb-2">Backward Timeline & Day-of Run Sheet</h2>
        <div className="space-y-3">
          {plan.timeline.map((m, i) => (
            <div key={i} className="border-b border-gray-300 pb-2">
              <div className="flex justify-between text-xs font-bold">
                <span>{m.title}</span>
                <span>{m.when}</span>
              </div>
              <ul className="mt-1 list-disc pl-5 text-xs">
                {m.tasks.map((t, ti) => (
                  <li key={ti}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Checklist */}
      <div className="print-page-break print-break-inside-avoid">
        <h2 className="text-lg font-bold border-b border-black pb-1 mb-2">Vendor Due Diligence & Checklist</h2>
        <div className="grid grid-cols-2 gap-4">
          {plan.vendors.map((v) => (
            <div key={v.category} className="border border-gray-300 p-2 text-xs">
              <h3 className="font-bold border-b border-gray-200 pb-1">{v.category}</h3>
              <div className="mt-1">
                <span className="font-semibold">Tasks:</span>
                <ul className="list-disc pl-4 mt-0.5">
                  {v.tasks.map((t, ti) => (
                    <li key={ti}>[ ] {t}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <span className="font-semibold">Ask Vendor:</span>
                <ul className="list-disc pl-4 mt-0.5 text-gray-700">
                  {v.questions.map((q, qi) => (
                    <li key={qi}>"{q}"</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Themes, Menu, Activities */}
      <div className="print-break-inside-avoid">
        <h2 className="text-lg font-bold border-b border-black pb-1 mb-2">Creative Direction, Menu & Activities</h2>
        <div className="text-xs space-y-2">
          <div>
            <strong>Themes:</strong> {plan.ideas.themes.map((t) => `${t.title} (${t.description})`).join(" | ")}
          </div>
          <div>
            <strong>Menu:</strong> {plan.ideas.menu.join(", ")}
          </div>
          <div>
            <strong>Guest Activities:</strong> {plan.ideas.activities.join(", ")}
          </div>
        </div>
      </div>
    </div>
  );
}

