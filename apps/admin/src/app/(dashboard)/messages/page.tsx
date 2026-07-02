import { createClient } from "@repo/supabase/server";
import type { ContactMessage } from "@repo/supabase";
import PageHeader from "@/components/PageHeader";
import { toggleMessageRead, deleteMessage } from "./actions";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const supabase = await createClient();
  // contact_messages is fed by the public contact form and grows without bound,
  // so cap the view to the 200 most recent enquiries to keep this page fast.
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const messages = (data ?? []) as ContactMessage[];

  return (
    <div>
      <PageHeader
        title="Messages"
        subtitle="Enquiries submitted through the website contact form."
      />

      {messages.length ? (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`card p-5 ${
                m.is_read ? "" : "border-l-4 border-l-burgundy"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">
                    {m.name}
                    {!m.is_read && (
                      <span className="ml-2 rounded-full bg-burgundy px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                        New
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted">
                    <a href={`mailto:${m.email}`} className="hover:text-burgundy">
                      {m.email}
                    </a>
                    {m.phone && <span> · {m.phone}</span>}
                  </p>
                </div>
                <span className="text-xs text-muted">
                  {new Date(m.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-line text-sm text-ink/80">
                {m.message}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <form action={toggleMessageRead}>
                  <input type="hidden" name="id" value={m.id} />
                  <input
                    type="hidden"
                    name="value"
                    value={(!m.is_read).toString()}
                  />
                  <button type="submit" className="btn-ghost px-3 py-1.5">
                    {m.is_read ? "Mark as unread" : "Mark as read"}
                  </button>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" className="btn-danger px-3 py-1.5">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-10 text-center text-muted">
          No messages yet.
        </div>
      )}
    </div>
  );
}
