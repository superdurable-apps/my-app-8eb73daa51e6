import { useMemo, useState } from 'react';

type Tag = { id: string; label: string; color?: string };
type Message = {
  id: string;
  subject: string;
  body: string;
  tags: string[];
  from: string;
  date: string; // ISO
  unread?: boolean;
};

const sampleTags: Tag[] = [
  { id: 'urgent', label: 'Urgent', color: '#ff6b6b' },
  { id: 'billing', label: 'Billing', color: '#ffd166' },
  { id: 'feature', label: 'Feature', color: '#6ae4c4' },
];

const sampleMessages: Message[] = Array.from({ length: 8 }).map((_, i) => ({
  id: String(i + 1),
  subject: ['Login issue', 'Billing question', 'Feature request', 'Account hacked', 'Refund', 'Slow app', 'Password reset', 'Integration error'][i % 8],
  body:
    "Hi, we're seeing an issue and need help. Can you look into this? Please advise with next steps and possible workarounds. Thanks!",
  tags: i % 3 === 0 ? ['urgent'] : i % 3 === 1 ? ['billing'] : ['feature'],
  from: ['alice@example.com', 'bob@acme.com', 'carol@startup.io', 'dave@corp.com'][i % 4],
  date: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
  unread: i < 3,
}));

export function App() {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [tags] = useState<Tag[]>(sampleTags);
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(messages[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      if (activeTag && !m.tags.includes(activeTag)) return false;
      if (!q) return true;
      return m.subject.toLowerCase().includes(q) || m.body.toLowerCase().includes(q) || m.from.toLowerCase().includes(q);
    });
  }, [messages, query, activeTag]);

  function openMessage(id: string) {
    setSelected(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
  }

  function toggleTagFilter(tagId: string) {
    setActiveTag((t) => (t === tagId ? null : tagId));
  }

  return (
    <main>
      <header>
        <p className="eyebrow">CUSTOMER SUPPORT</p>
        <h1>Inbox</h1>
        <p className="lede">Manage conversations, filter by tags, and search messages.</p>
      </header>

      <section className="panel inbox">
        <div className="inbox-controls">
          <input
            aria-label="Search messages"
            placeholder="Search by subject, body, or sender"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="tag-row">
            <button
              className={!activeTag ? 'active' : ''}
              onClick={() => setActiveTag(null)}
            >
              All
            </button>
            {tags.map((t) => (
              <button
                key={t.id}
                className={activeTag === t.id ? 'active' : ''}
                onClick={() => toggleTagFilter(t.id)}
                style={{ borderColor: t.color }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="inbox-body">
          <aside className="list">
            {filtered.length === 0 && <p className="empty">No messages match your search.</p>}
            {filtered.map((m) => (
              <div
                key={m.id}
                role="button"
                tabIndex={0}
                className={`message ${selected === m.id ? 'selected' : ''}`}
                onClick={() => openMessage(m.id)}
              >
                <div className="meta">
                  <strong className="subject">{m.subject}</strong>
                  <span className="from">{m.from}</span>
                </div>
                <div className="bottom">
                  <span className="snippet">{m.body.slice(0, 80)}{m.body.length > 80 ? '…' : ''}</span>
                  <div className="badges">
                    {m.unread && <span className="badge unread">New</span>}
                    {m.tags.map((tag) => (
                      <span key={tag} className="badge tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </aside>

          <article className="detail">
            {selected ? (
              (() => {
                const msg = messages.find((m) => m.id === selected)!;
                return (
                  <>
                    <div className="detail-header">
                      <div>
                        <h2>{msg.subject}</h2>
                        <p className="muted">From {msg.from} • {new Date(msg.date).toLocaleString()}</p>
                      </div>
                      <div className="action-buttons">
                        <button onClick={() => alert('Reply (mock)')}>Reply</button>
                        <button onClick={() => alert('Close (mock)')}>Close</button>
                      </div>
                    </div>
                    <div className="detail-body">
                      <p>{msg.body}</p>
                    </div>
                    <div className="detail-tags">
                      {msg.tags.map((t) => (
                        <span key={t} className="badge tag">{t}</span>
                      ))}
                    </div>
                  </>
                );
              })()
            ) : (
              <p>Select a message to view its contents.</p>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}

