import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, CheckCheck, ChevronRight, Inbox, LockKeyhole, LogOut, Mail, MailOpen, RefreshCw, Search, ShieldCheck, UserRound } from "lucide-react";
import "../styles/inbox.css";

const SUPABASE_URL = "https://khagjlnczaihgkohmpmg.supabase.co";
const SUPABASE_KEY = "sb_publishable_lqi_R3QWs0pInCEemHAhoA_mrmM7i3v";
const OWNER_EMAIL = "zeehadhaque@gmail.com";
const SESSION_KEY = "zee-owner-inbox-session-v1";

type Session = { access_token: string; refresh_token: string; expires_at: number };
type ContactMessage = { id: string; name: string; email: string; subject: string; message: string; created_at: string; is_read: boolean };
type AuthPayload = { access_token?: string; refresh_token?: string; expires_at?: number; expires_in?: number; message?: string; msg?: string; error_description?: string };
type AuthUser = { email?: string; email_confirmed_at?: string | null };

function storedSession(): Session | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<Session>;
    if (typeof value.access_token !== "string" || typeof value.refresh_token !== "string" || typeof value.expires_at !== "number") return null;
    return value as Session;
  } catch { return null; }
}
function saveSession(session: Session) { window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
function clearSession() { window.sessionStorage.removeItem(SESSION_KEY); }
function toSession(payload: AuthPayload): Session {
  if (!payload.access_token || !payload.refresh_token) throw new Error("Authentication response was incomplete.");
  return { access_token: payload.access_token, refresh_token: payload.refresh_token, expires_at: payload.expires_at ?? Math.floor(Date.now() / 1000) + (payload.expires_in ?? 3600) };
}
async function freshSession(session: Session): Promise<Session> {
  if (session.expires_at * 1000 > Date.now() + 60_000) return session;
  const response = await fetch(SUPABASE_URL + "/auth/v1/token?grant_type=refresh_token", {
    method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });
  const payload = await response.json() as AuthPayload;
  if (!response.ok) throw new Error(payload.message || payload.msg || "Your session expired. Please sign in again.");
  const next = toSession(payload); saveSession(next); return next;
}
async function verifyOwner(session: Session): Promise<void> {
  const response = await fetch(SUPABASE_URL + "/auth/v1/user", { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + session.access_token } });
  if (!response.ok) throw new Error("Owner session could not be verified. Please sign in again.");
  const user = await response.json() as AuthUser;
  if (user.email?.toLowerCase() !== OWNER_EMAIL || !user.email_confirmed_at) throw new Error("This account does not have verified owner access.");
}
function dateLabel(value: string, compact = false): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-GB", compact
    ? { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }
    : { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

export function InboxApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [authError, setAuthError] = useState("");
  const [actionError, setActionError] = useState("");
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [search, setSearch] = useState("");

  const unreadCount = useMemo(() => messages.filter((item) => !item.is_read).length, [messages]);
  const selected = useMemo(() => messages.find((item) => item.id === selectedId) ?? null, [messages, selectedId]);
  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return messages.filter((item) => {
      if (filter === "unread" && item.is_read) return false;
      return !term || [item.name, item.email, item.subject, item.message].some((value) => value.toLowerCase().includes(term));
    });
  }, [filter, messages, search]);

  const loadMessages = useCallback(async (current: Session) => {
    const active = await freshSession(current);
    if (active !== current) setSession(active);
    const response = await fetch("/api/contact", { headers: { Authorization: "Bearer " + active.access_token }, cache: "no-store" });
    if (response.status === 401) throw new Error("Your owner session is no longer valid. Please sign in again.");
    const payload = await response.json() as { messages?: ContactMessage[]; message?: string };
    if (!response.ok || !Array.isArray(payload.messages)) throw new Error(payload.message || "Messages could not be loaded.");
    setMessages(payload.messages);
    setSelectedId((id) => id && payload.messages?.some((item) => item.id === id) ? id : null);
  }, []);

  useEffect(() => {
    let active = true;
    async function restore() {
      const saved = storedSession();
      if (!saved) { if (active) setReady(true); return; }
      try {
        const next = await freshSession(saved);
        await verifyOwner(next);
        if (!active) return;
        setSession(next);
        await loadMessages(next);
      } catch (error) {
        clearSession();
        if (active) { setSession(null); setAuthError(error instanceof Error ? error.message : "Please sign in again."); }
      } finally { if (active) setReady(true); }
    }
    void restore();
    return () => { active = false; };
  }, [loadMessages]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setAuthError(""); setLoggingIn(true);
    try {
      const response = await fetch(SUPABASE_URL + "/auth/v1/token?grant_type=password", {
        method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email: OWNER_EMAIL, password }),
      });
      const payload = await response.json() as AuthPayload;
      if (!response.ok) throw new Error(payload.message || payload.msg || payload.error_description || "Sign-in failed. Check your owner account password.");
      const next = toSession(payload);
      await verifyOwner(next);
      saveSession(next); setSession(next); setPassword("");
      await loadMessages(next);
    } catch (error) {
      clearSession(); setSession(null);
      setAuthError(error instanceof Error ? error.message : "Could not sign in.");
    } finally { setLoggingIn(false); }
  }

  async function refreshInbox() {
    if (!session) return;
    setRefreshing(true); setActionError("");
    try { await loadMessages(session); }
    catch (error) {
      const message = error instanceof Error ? error.message : "Could not refresh the inbox.";
      setActionError(message);
      if (message.toLowerCase().includes("session")) { clearSession(); setSession(null); }
    } finally { setRefreshing(false); }
  }

  async function toggleRead(item: ContactMessage) {
    if (!session || updating) return;
    setUpdating(true); setActionError("");
    try {
      const active = await freshSession(session);
      if (active !== session) setSession(active);
      const response = await fetch("/api/contact", {
        method: "PATCH",
        headers: { Authorization: "Bearer " + active.access_token, "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, is_read: !item.is_read }),
      });
      const payload = await response.json() as { message?: string };
      if (!response.ok) throw new Error(payload.message || "Read status could not be updated.");
      setMessages((current) => current.map((message) => message.id === item.id ? { ...message, is_read: !item.is_read } : message));
    } catch (error) { setActionError(error instanceof Error ? error.message : "Read status could not be updated."); }
    finally { setUpdating(false); }
  }

  async function logout() {
    const current = session;
    clearSession(); setSession(null); setMessages([]); setSelectedId(null); setAuthError("");
    if (!current) return;
    try {
      await fetch(SUPABASE_URL + "/auth/v1/logout", { method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + current.access_token } });
    } catch { /* Local session is already cleared. */ }
  }

  if (!ready) return <main className="zi-page zi-centered"><div><div className="zi-loading-mark"><Inbox size={22} /></div><p className="zi-muted">Opening private inbox…</p></div></main>;

  if (!session) return (
    <main className="zi-page zi-centered">
      <div className="zi-login-wrap">
        <a className="zi-brand" href="/"><span className="zi-brand-mark">Z</span><span>ZEEHAD <b>INBOX</b></span></a>
        <section className="zi-login-card">
          <div className="zi-lock-icon"><LockKeyhole size={21} /></div>
          <p className="zi-eyebrow">PRIVATE OWNER ACCESS</p>
          <h1>Welcome back.</h1>
          <p className="zi-login-copy">Sign in to view messages sent through your filmmaker portfolio.</p>
          <form onSubmit={login}>
            <label className="zi-field-label" htmlFor="owner-email">OWNER ACCOUNT</label>
            <div className="zi-owner-email"><UserRound size={16} /><span id="owner-email">{OWNER_EMAIL}</span><ShieldCheck size={16} /></div>
            <label className="zi-field-label" htmlFor="owner-password">PASSWORD</label>
            <input id="owner-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your owner password" required minLength={6} autoFocus />
            {authError && <p className="zi-error" role="alert">{authError}</p>}
            <button className="zi-primary-button" type="submit" disabled={loggingIn || !password}>
              {loggingIn ? <RefreshCw className="zi-spin" size={16} /> : <LockKeyhole size={16} />}
              {loggingIn ? "VERIFYING ACCESS" : "ENTER INBOX"}
            </button>
          </form>
          <p className="zi-secure-note"><ShieldCheck size={14} /> Verified owner account only</p>
        </section>
        <a className="zi-back-link" href="/">Return to portfolio <ChevronRight size={14} /></a>
      </div>
    </main>
  );

  return (
    <main className="zi-page">
      <div className="zi-app-shell">
        <header className="zi-header">
          <a className="zi-brand" href="/"><span className="zi-brand-mark">Z</span><span>ZEEHAD <b>INBOX</b></span></a>
          <div className="zi-header-actions">
            <span className="zi-private-label"><span /> PRIVATE</span>
            <button className="zi-icon-button" type="button" onClick={refreshInbox} disabled={refreshing} title="Refresh inbox" aria-label="Refresh inbox"><RefreshCw className={refreshing ? "zi-spin" : ""} size={17} /></button>
            <button className="zi-logout-button" type="button" onClick={logout}><LogOut size={15} /><span>Sign out</span></button>
          </div>
        </header>
        <section className="zi-intro">
          <div><p className="zi-eyebrow">YOUR PRIVATE MESSAGE ARCHIVE</p><h1>Inbox<span>.</span></h1><p className="zi-intro-copy">Messages sent through your filmmaker portfolio.</p></div>
          <div className="zi-summary">
            <div><span className="zi-summary-value">{messages.length}</span><span className="zi-summary-label">TOTAL MESSAGES</span></div>
            <div className="zi-summary-divider" />
            <div><span className="zi-summary-value">{unreadCount}</span><span className="zi-summary-label">UNREAD</span></div>
          </div>
        </section>
        {actionError && <p className="zi-inline-error" role="alert">{actionError}</p>}
        <section className={"zi-workspace" + (selected ? " zi-has-selection" : "")}>
          <aside className="zi-list-panel">
            <div className="zi-list-heading">
              <div className="zi-list-title"><Inbox size={17} /><span>ALL MESSAGES</span><b>{messages.length}</b></div>
              <div className="zi-filter-tabs" role="group" aria-label="Message filter">
                <button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
                <button type="button" className={filter === "unread" ? "active" : ""} onClick={() => setFilter("unread")}>Unread <span>{unreadCount}</span></button>
              </div>
            </div>
            <label className="zi-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages…" />{search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")}>×</button>}</label>
            <div className="zi-message-list">
              {visible.length === 0 ? (
                <div className="zi-list-empty"><Mail size={23} /><p>{messages.length === 0 ? "Your inbox is empty." : "No messages match this view."}</p><span>{messages.length === 0 ? "New contact submissions will appear here." : "Try another search or filter."}</span></div>
              ) : visible.map((item) => (
                <button type="button" className={"zi-message-row" + (selectedId === item.id ? " selected" : "") + (item.is_read ? " read" : " unread")} key={item.id} onClick={() => setSelectedId(item.id)}>
                  <span className="zi-avatar">{item.name.trim().charAt(0).toUpperCase() || "?"}</span>
                  <span className="zi-row-content">
                    <span className="zi-row-top"><strong>{item.name}</strong><time dateTime={item.created_at}>{dateLabel(item.created_at, true)}</time></span>
                    <span className="zi-row-subject">{item.subject || "No subject"}</span>
                    <span className="zi-row-preview">{item.message}</span>
                  </span>
                  {!item.is_read && <span className="zi-unread-dot" aria-label="Unread" />}
                </button>
              ))}
            </div>
            <div className="zi-list-footer"><ShieldCheck size={13} /> Private messages · Owner access only</div>
          </aside>
          <section className="zi-detail-panel" aria-live="polite">
            {selected ? (
              <>
                <div className="zi-detail-top">
                  <button className="zi-mobile-back" type="button" onClick={() => setSelectedId(null)}><ArrowLeft size={16} /> Back to messages</button>
                  <div className="zi-detail-actions">
                    <span className={selected.is_read ? "zi-status read" : "zi-status unread"}>{selected.is_read ? <CheckCheck size={14} /> : <Mail size={14} />}{selected.is_read ? "READ" : "UNREAD"}</span>
                    <button className="zi-mark-button" type="button" onClick={() => void toggleRead(selected)} disabled={updating}>{selected.is_read ? <Mail size={15} /> : <Check size={15} />}{selected.is_read ? "Mark unread" : "Mark as read"}</button>
                  </div>
                </div>
                <article className="zi-message-detail">
                  <p className="zi-eyebrow">INCOMING MESSAGE</p>
                  <h2>{selected.subject || "No subject"}</h2>
                  <div className="zi-sender-card">
                    <span className="zi-avatar zi-avatar-large">{selected.name.trim().charAt(0).toUpperCase() || "?"}</span>
                    <div className="zi-sender-info"><strong>{selected.name}</strong><a href={"mailto:" + selected.email}>{selected.email}</a></div>
                    <time dateTime={selected.created_at}>{dateLabel(selected.created_at)}</time>
                  </div>
                  <div className="zi-message-body"><p>{selected.message}</p></div>
                  <div className="zi-message-meta"><MailOpen size={14} /> Received {dateLabel(selected.created_at)}</div>
                </article>
              </>
            ) : (
              <div className="zi-detail-empty"><div className="zi-empty-icon"><MailOpen size={25} /></div><p className="zi-eyebrow">MESSAGE PREVIEW</p><h2>Select a message</h2><p>Choose a message from the list to read its full details.</p></div>
            )}
          </section>
        </section>
        <footer className="zi-footer"><span>© {new Date().getFullYear()} ZEEHAD HAQUE</span><span>PRIVATE MESSAGE ARCHIVE</span></footer>
      </div>
    </main>
  );
}
