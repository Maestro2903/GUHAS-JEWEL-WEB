// Shown instantly on every dashboard navigation while the page's Server
// Component fetches its data. Keeps the sidebar/nav in place (this renders in
// the layout's <main>) and swaps in a lightweight skeleton so page switches
// feel immediate instead of blocking on the server round-trip.
export default function DashboardLoading() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      {/* Page header placeholder */}
      <div className="mb-8">
        <div className="h-8 w-48 rounded-md bg-black/10" />
        <div className="mt-3 h-4 w-72 max-w-full rounded bg-black/5" />
      </div>

      {/* Content rows placeholder */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="card flex items-center gap-4 p-4"
          >
            <div className="h-12 w-12 shrink-0 rounded-md bg-black/10" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-black/10" />
              <div className="h-3 w-1/2 rounded bg-black/5" />
            </div>
            <div className="h-7 w-16 rounded-full bg-black/5" />
          </div>
        ))}
      </div>

      <span className="sr-only">Loading…</span>
    </div>
  );
}
