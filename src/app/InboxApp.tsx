import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Check, CheckCheck, ChevronRight, Inbox, LockKeyhole, LogOut, Mail, MailOpen, RefreshCw, Search, ShieldCheck, UserRound } from "lucide-react";
import "../styles/inbox.css";
import { CastleUniverse } from "../components/three/CastleUniverse";
import type { ChamberId } from "../utils/castleConfig";
import { useReducedMotion } from "../hooks/useReducedMotion";

const SUPABASE_URL = "https://khagjlnczaihgkohmpmg.supabase.co";
const SUPABASE_KEY = "sb_publishable_lqi_R3QWs0pInCEemHAhoA_mrmM7i3v";
const OWNER_EMAIL = "zeehadhaque@gmail.com";
const SESSION_KEY = "zee-owner-inbox-session-v1";
const INSTAGRAM_URL = "https://www.instagram.com/heyyfalgun/";

type Session = { access_token: string; refresh_token: string; expires_at: number };
type ContactMessage = { id: string; name: string; email: string; subject: string; message: string; created_at: string; is_read: boolean };
type AuthPayload = { access_token?: string; refresh_token?: string; expires_at?: number; expires_in?: number; message?: string; msg?: string; error_description?: string };
type AuthUser = { email?: string; email_confirmed_at?: string | null };

const INBOX_CHAMBERS: ChamberId[] = ["foyer", "screening-hall", "projection-room", "directors-suite", "institute", "intelligence", "grand-exit"];

function InstagramMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

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
  const reducedMotion = useReducedMotion();
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeChamber = INBOX_CHAMBERS[Math.min(INBOX_CHAMBERS.length - 1, Math.floor(scrollProgress * INBOX_CHAMBERS.length))];
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

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      setScrollProgress(progress);
      document.documentElement.style.setProperty("--zi-scroll-progress", progress.toFixed(4));
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.documentElement.style.removeProperty("--zi-scroll-progress");
    };
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".zi-reveal"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.classList.add("is-visible");
        observer.unobserve(element);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    elements.forEach((element, index) => {
      element.style.setProperty("--zi-stagger", `${(index % 7) * 85}ms`);
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [session, messages.length, selectedId]);

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
      <CastleUniverse activeChamber={activeChamber} scrollProgress={scrollProgress} liteMode={false} reducedMotion={reducedMotion} />
      <div className="zi-login-wrap zi-reveal">
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
    <main className="zi-page zi-journey-page">
      <CastleUniverse activeChamber={activeChamber} scrollProgress={scrollProgress} liteMode={false} reducedMotion={reducedMotion} />
      <div className="zi-app-shell zi-journey-shell">
        <header className="zi-header zi-fixed-header">
          <a className="zi-brand" href="/"><span className="zi-brand-mark">Z</span><span>ZEEHAD <b>INBOX</b></span></a>
          <div className="zi-header-actions">
            <span className="zi-private-label"><span /> PRIVATE</span>
            <button className="zi-icon-button" type="button" onClick={refreshInbox} disabled={refreshing} title="Refresh inbox" aria-label="Refresh inbox"><RefreshCw className={refreshing ? "zi-spin" : ""} size={17} /></button>
            <button className="zi-logout-button" type="button" onClick={logout}><LogOut size={15} /><span>Sign out</span></button>
          </div>
        </header>

        <nav className="zi-chamber-rail" aria-label="Mansion chambers">
          <span className="zi-rail-track"><span className="zi-rail-fill" /></span>
          <a href="#zi-grand-foyer" className={activeChamber === "foyer" ? "active" : ""} aria-label="01 Grand Foyer">01</a>
          <a href="#zi-foyer-records" className={activeChamber === "screening-hall" ? "active" : ""} aria-label="02 Foyer Records">02</a>
          <a href="#zi-message-gallery" className={activeChamber === "projection-room" ? "active" : ""} aria-label="03 Message Gallery">03</a>
          <a href="#zi-reading-room" className={activeChamber === "directors-suite" ? "active" : ""} aria-label="04 Reading Room">04</a>
          <a href="#zi-sender-study" className={activeChamber === "institute" ? "active" : ""} aria-label="05 Sender Study">05</a>
          <a href="#zi-archive-ledger" className={activeChamber === "intelligence" ? "active" : ""} aria-label="06 Archive Ledger">06</a>
          <a href="#zi-grand-exit" className={activeChamber === "grand-exit" ? "active" : ""} aria-label="07 Grand Exit">07</a>
        </nav>

        <section className="zi-stage zi-stage-hero" id="zi-grand-foyer">
          <div className="zi-stage-frame zi-hero-frame">
            <p className="zi-eyebrow zi-reveal">THE PRIVATE COMMUNICATION CHAMBER · EST. 2026</p>
            <h1 className="zi-hero-title zi-reveal"><span>PRIVATE</span><span className="zi-hero-title-accent">ARCHIVE</span></h1>
            <p className="zi-hero-copyline zi-reveal">A private passage through every message, thought and opportunity sent your way.</p>
            <a className="zi-scroll-cue" href="#zi-foyer-records"><span>DESCEND INTO THE MANSION</span><span className="zi-scroll-cue-line" /></a>
            <div className="zi-stage-index"><span>CHAMBER 01</span><span>THE GRAND FOYER</span></div>
          </div>
        </section>

        <section className="zi-stage" id="zi-foyer-records">
          <div className="zi-stage-frame zi-stage-frame-narrow">
            <div className="zi-stage-heading zi-reveal"><p className="zi-eyebrow">CHAMBER 02 · THE FOYER RECORDS</p><h2 className="zi-stage-title">First look<span>.</span></h2><p className="zi-stage-description">A quiet overview of everything that has arrived at your door.</p></div>
            <div className="zi-stat-columns zi-reveal">
              <article className="zi-stat-plinth"><span className="zi-stat-number">{String(messages.length).padStart(2, "0")}</span><span className="zi-stat-label">TOTAL ARRIVALS</span><span className="zi-stat-detail">Every saved submission</span></article>
              <article className="zi-stat-plinth zi-stat-plinth-accent"><span className="zi-stat-number">{String(unreadCount).padStart(2, "0")}</span><span className="zi-stat-label">UNREAD NOTES</span><span className="zi-stat-detail">Waiting to be discovered</span></article>
            </div>
            {actionError && <p className="zi-inline-error" role="alert">{actionError}</p>}
            <div className="zi-latest-plaque zi-reveal">
              <div className="zi-plaque-top"><span>THE LATEST ARRIVAL</span><span>{messages[0] ? dateLabel(messages[0].created_at, true) : "NO ARRIVALS"}</span></div>
              {messages[0] ? <><p className="zi-latest-name">{messages[0].name}</p><p className="zi-latest-subject">{messages[0].subject || "No subject"}</p><p className="zi-latest-preview">{messages[0].message}</p><a className="zi-text-link" href="#zi-message-gallery">EXPLORE THE MESSAGE GALLERY <ChevronRight size={14} /></a></> : <div className="zi-empty-copy"><Mail size={19} /><span>Your first incoming message will appear here.</span></div>}
            </div>
            <div className="zi-stage-index"><span>02 / 07</span><span>THE FOYER RECORDS</span></div>
          </div>
        </section>

        <section className="zi-stage" id="zi-message-gallery">
          <div className="zi-stage-frame zi-stage-frame-gallery">
            <div className="zi-stage-heading zi-reveal"><p className="zi-eyebrow">CHAMBER 03 · THE MESSAGE GALLERY</p><h2 className="zi-stage-title">Arrivals<span>.</span></h2><p className="zi-stage-description">Move through the archive. Choose one message before descending further.</p></div>
            <div className="zi-gallery-console zi-reveal">
              <div className="zi-gallery-toolbar">
                <div className="zi-list-title"><Inbox size={17} /><span>INCOMING MESSAGES</span><b>{visible.length}</b></div>
                <div className="zi-filter-tabs" role="group" aria-label="Message filter">
                  <button type="button" className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
                  <button type="button" className={filter === "unread" ? "active" : ""} onClick={() => setFilter("unread")}>Unread <span>{unreadCount}</span></button>
                </div>
              </div>
              <label className="zi-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the archive…" />{search && <button type="button" aria-label="Clear search" onClick={() => setSearch("")}>×</button>}</label>
              <div className="zi-message-list zi-gallery-list">
                {visible.length === 0 ? <div className="zi-list-empty"><Mail size={23} /><p>{messages.length === 0 ? "The gallery is empty." : "No messages match this view."}</p><span>{messages.length === 0 ? "New contact submissions will appear here." : "Try another search or filter."}</span></div> :
                  visible.map((item) => (
                    <button type="button" className={"zi-message-row" + (selectedId === item.id ? " selected" : "") + (item.is_read ? " read" : " unread")} key={item.id} onClick={() => setSelectedId(item.id)}>
                      <span className="zi-avatar">{item.name.trim().charAt(0).toUpperCase() || "?"}</span>
                      <span className="zi-row-content"><span className="zi-row-top"><strong>{item.name}</strong><time dateTime={item.created_at}>{dateLabel(item.created_at, true)}</time></span><span className="zi-row-subject">{item.subject || "No subject"}</span><span className="zi-row-preview">{item.message}</span></span>
                      {!item.is_read && <span className="zi-unread-dot" aria-label="Unread" />}
                    </button>
                  ))}
              </div>
              <div className="zi-list-footer"><ShieldCheck size={13} /> Private archive · Verified owner access</div>
            </div>
            <div className="zi-gallery-next"><span>{selected ? "ONE MESSAGE SELECTED" : "SELECT A MESSAGE TO CONTINUE"}</span><a className={"zi-enter-button" + (!selected ? " is-disabled" : "")} href={selected ? "#zi-reading-room" : "#zi-message-gallery"} aria-disabled={!selected}>CONTINUE DEEPER <ChevronRight size={15} /></a></div>
            <div className="zi-stage-index"><span>03 / 07</span><span>THE MESSAGE GALLERY</span></div>
          </div>
        </section>

        <section className="zi-stage" id="zi-reading-room">
          <div className="zi-stage-frame zi-stage-frame-narrow">
            <div className="zi-stage-heading zi-reveal"><p className="zi-eyebrow">CHAMBER 04 · THE PRIVATE READING ROOM</p><h2 className="zi-stage-title">The message<span>.</span></h2><p className="zi-stage-description">Step closer. The selected message is revealed in full.</p></div>
            {selected ? <article className="zi-reading-plaque zi-reveal">
              <div className="zi-detail-top"><span className={selected.is_read ? "zi-status read" : "zi-status unread"}>{selected.is_read ? <CheckCheck size={14} /> : <Mail size={14} />}{selected.is_read ? "READ" : "UNREAD"}</span><span className="zi-reading-date">{dateLabel(selected.created_at)}</span></div>
              <h3>{selected.subject || "No subject"}</h3><div className="zi-message-body"><p>{selected.message}</p></div>
              <a className="zi-text-link" href="#zi-sender-study">CONTINUE TO SENDER DETAILS <ChevronRight size={14} /></a>
            </article> : <div className="zi-reading-plaque zi-empty-reading zi-reveal"><div className="zi-empty-icon"><MailOpen size={25} /></div><h3>No message selected</h3><p>Return to the Message Gallery and choose an arrival to read its full contents.</p><a className="zi-text-link" href="#zi-message-gallery">BACK TO MESSAGE GALLERY <ChevronRight size={14} /></a></div>}
            <div className="zi-stage-index"><span>04 / 07</span><span>THE PRIVATE READING ROOM</span></div>
          </div>
        </section>

        <section className="zi-stage" id="zi-sender-study">
          <div className="zi-stage-frame zi-stage-frame-narrow">
            <div className="zi-stage-heading zi-reveal"><p className="zi-eyebrow">CHAMBER 05 · THE SENDER STUDY</p><h2 className="zi-stage-title">Who reached out<span>?</span></h2><p className="zi-stage-description">The sender's details, preserved with the original message.</p></div>
            {selected ? <article className="zi-sender-study-card zi-reveal">
              <div className="zi-sender-monogram">{selected.name.trim().charAt(0).toUpperCase() || "?"}</div><p className="zi-sender-label">MESSAGE RECEIVED FROM</p><h3>{selected.name}</h3>
              <a className="zi-sender-email" href={"mailto:" + selected.email}>{selected.email}</a>
              <div className="zi-sender-facts"><div><span>RECEIVED</span><strong>{dateLabel(selected.created_at)}</strong></div><div><span>READ STATUS</span><strong className={selected.is_read ? "zi-read-text" : "zi-unread-text"}>{selected.is_read ? "Read" : "Unread"}</strong></div></div>
              <button className="zi-mark-button zi-mark-large" type="button" onClick={() => void toggleRead(selected)} disabled={updating}>{selected.is_read ? <Mail size={15} /> : <Check size={15} />}{selected.is_read ? "Mark as unread" : "Mark as read"}</button>
            </article> : <div className="zi-reading-plaque zi-empty-reading zi-reveal"><h3>Sender details are waiting</h3><p>Select a message in the Message Gallery first.</p></div>}
            <div className="zi-stage-index"><span>05 / 07</span><span>THE SENDER STUDY</span></div>
          </div>
        </section>

        <section className="zi-stage" id="zi-archive-ledger">
          <div className="zi-stage-frame zi-stage-frame-ledger">
            <div className="zi-stage-heading zi-reveal"><p className="zi-eyebrow">CHAMBER 06 · THE ARCHIVE LEDGER</p><h2 className="zi-stage-title">Nothing lost<span>.</span></h2><p className="zi-stage-description">A chronological record of every submission kept in your private archive.</p></div>
            <div className="zi-ledger-summary zi-reveal"><span><b>{messages.length}</b> STORED</span><span><b>{unreadCount}</b> UNREAD</span><span><b>{messages.length - unreadCount}</b> READ</span></div>
            <div className="zi-ledger-list zi-reveal">
              {messages.length === 0 ? <div className="zi-ledger-empty"><Inbox size={22} /><span>Your archive will begin with the first message submitted through your portfolio.</span></div> :
                messages.map((item, index) => (
                  <button key={item.id} className={"zi-ledger-row" + (selectedId === item.id ? " active" : "")} type="button" onClick={() => setSelectedId(item.id)}>
                    <span className="zi-ledger-number">{String(index + 1).padStart(2, "0")}</span><span className="zi-ledger-main"><strong>{item.subject || "No subject"}</strong><small>{item.name} · {dateLabel(item.created_at, true)}</small></span>
                    <span className={"zi-ledger-status" + (item.is_read ? " read" : " unread")}>{item.is_read ? "READ" : "UNREAD"}</span><ChevronRight size={15} />
                  </button>
                ))}
            </div>
            {actionError && <p className="zi-inline-error" role="alert">{actionError}</p>}
            <div className="zi-stage-index"><span>06 / 07</span><span>THE ARCHIVE LEDGER</span></div>
          </div>
        </section>

        <section className="zi-stage zi-stage-exit" id="zi-grand-exit">
          <div className="zi-stage-frame zi-exit-frame">
            <p className="zi-eyebrow zi-reveal">CHAMBER 07 · THE GRAND EXIT</p>
            <div className="zi-exit-emblem zi-reveal"><InstagramMark size={32} /></div>
            <h2 className="zi-exit-title zi-reveal">Beyond the frame<span>.</span></h2>
            <p className="zi-exit-copy zi-reveal">The archive ends here. The creative journey continues elsewhere.</p>
            <a className="zi-instagram-portal zi-reveal" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><span className="zi-instagram-icon"><InstagramMark size={19} /></span><span><small>FOLLOW THE JOURNEY</small><strong>@heyyfalgun</strong></span><ChevronRight size={19} /></a>
            <a className="zi-return-top" href="#zi-grand-foyer">RETURN TO THE GRAND FOYER ↑</a>
            <div className="zi-stage-index"><span>07 / 07</span><span>THE GRAND EXIT · INSTAGRAM</span></div>
          </div>
        </section>

        <footer className="zi-journey-footer"><span>© {new Date().getFullYear()} ZEEHAD HAQUE</span><span>THE INFINITE PRIVATE ARCHIVE</span></footer>
      </div>
    </main>
  );
}
