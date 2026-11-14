import { useMemo, useState, type FormEvent } from "react";
import { BookOpen, Megaphone, Search, ShieldCheck, UserCheck } from "lucide-react";
import {
  academyDays,
  academyEntitlements,
  type AcademyLanguage,
} from "../../data/academy";

export interface AdminStudent {
  user_id: string;
  display_name: string;
  email: string;
  created_at: string;
}

export interface AdminStudentEntitlement {
  user_id: string;
  entitlement_key: string;
  expires_at: string | null;
  granted_at: string;
}

interface AcademyAdminPanelProps {
  language: AcademyLanguage;
  students: readonly AdminStudent[];
  studentEntitlements: readonly AdminStudentEntitlement[];
  busy: boolean;
  onGrant: (params: {
    userId: string;
    entitlementKey: string;
    days: string;
    note: string;
  }) => Promise<void>;
  onRevoke: (studentId: string, entitlementKey: string) => Promise<void>;
  onInspectDay: (day: number) => void;
}

const NOTICE_STORAGE_KEY = "zee-academy-admin-notice-v1";

export function AcademyAdminPanel({
  language,
  students,
  studentEntitlements,
  busy,
  onGrant,
  onRevoke,
  onInspectDay,
}: AcademyAdminPanelProps) {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [grantKey, setGrantKey] = useState("program.30day");
  const [grantDays, setGrantDays] = useState("30");
  const [grantNote, setGrantNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [announcement, setAnnouncement] = useState(() => {
    try {
      return localStorage.getItem(NOTICE_STORAGE_KEY) ?? "";
    } catch {
      return "";
    }
  });
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  const bn = language === "bn";
  const copy = (en: string, bnText: string) => (bn ? bnText : en);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.display_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q),
    );
  }, [students, searchQuery]);

  const activeEntitlementCount = useMemo(
    () =>
      studentEntitlements.filter(
        (entry) =>
          !entry.expires_at || Date.parse(entry.expires_at) > Date.now(),
      ).length,
    [studentEntitlements],
  );

  const handleGrant = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStudent) return;
    await onGrant({
      userId: selectedStudent,
      entitlementKey: grantKey,
      days: grantDays,
      note: grantNote,
    });
    setGrantNote("");
  };

  const saveAnnouncement = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      localStorage.setItem(NOTICE_STORAGE_KEY, announcement.trim());
      setAnnouncementSaved(true);
      window.setTimeout(() => setAnnouncementSaved(false), 2500);
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <section className="academy-admin">
      <div className="academy-section-intro">
        <span className="academy-eyebrow">Admin Only · Verified Owner Studio</span>
        <h3>{copy("Learner access & curriculum studio.", "Learner access ও curriculum studio.")}</h3>
        <p>
          {copy(
            "Manage cohort entitlements via protected Supabase RPC functions, inspect curriculum days, and publish studio announcements.",
            "Protected Supabase RPC function দিয়ে learner entitlement পরিচালনা করো এবং curriculum inspect করো।",
          )}
        </p>
      </div>

      {/* Studio Metrics Summary */}
      <div className="academy-admin__summary">
        <div>
          <UserCheck size={16} />
          <strong>{students.length}</strong>
          <span>{copy("Registered learners", "নিবন্ধিত learner")}</span>
        </div>
        <div>
          <ShieldCheck size={16} />
          <strong>{activeEntitlementCount}</strong>
          <span>{copy("Active entitlements", "সক্রিয় entitlement")}</span>
        </div>
        <div>
          <BookOpen size={16} />
          <strong>{academyDays.length}</strong>
          <span>{copy("Published curriculum days", "মোট lesson দিন")}</span>
        </div>
      </div>

      {/* Entitlement Grant Form */}
      <form className="academy-admin__grant" onSubmit={(e) => void handleGrant(e)}>
        <label>
          <span>{copy("Learner account", "Learner account")}</span>
          <select
            value={selectedStudent}
            onChange={(event) => setSelectedStudent(event.target.value)}
            required
          >
            <option value="">{copy("Choose a learner", "Learner বেছে নাও")}</option>
            {students.map((student) => (
              <option value={student.user_id} key={student.user_id}>
                {student.display_name} — {student.email}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{copy("Entitlement", "Entitlement")}</span>
          <select
            value={grantKey}
            onChange={(event) => setGrantKey(event.target.value)}
          >
            {academyEntitlements.map((entry) => (
              <option key={entry.key} value={entry.key}>
                {bn ? entry.title.bn : entry.title.en}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{copy("Duration", "সময়কাল")}</span>
          <select
            value={grantDays}
            onChange={(event) => setGrantDays(event.target.value)}
          >
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="365">365 days</option>
            <option value="permanent">{copy("Permanent", "স্থায়ী")}</option>
          </select>
        </label>
        <label className="academy-admin__note">
          <span>{copy("Admin note (optional)", "Admin note (ঐচ্ছিক)")}</span>
          <input
            value={grantNote}
            maxLength={300}
            onChange={(event) => setGrantNote(event.target.value)}
            placeholder="e.g. Cohort / scholarship / invitation"
          />
        </label>
        <button
          className="academy-primary-button"
          type="submit"
          disabled={!selectedStudent || busy}
        >
          {busy ? "…" : copy("Grant access", "Access grant করো")} ↗
        </button>
      </form>

      {/* Learner Directory with Search */}
      <div className="academy-admin__directory">
        <div className="academy-panel-heading academy-admin__dir-head">
          <div>
            <h3>{copy("Learner directory", "Learner directory")}</h3>
            <span className="academy-muted-inline">
              {filteredStudents.length} / {students.length} accounts
            </span>
          </div>
          <label className="academy-admin__search">
            <Search size={14} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={copy("Filter by name or email…", "নাম বা ইমেইল দিয়ে খুঁজো…")}
              aria-label="Filter learners"
            />
          </label>
        </div>

        {filteredStudents.map((student) => {
          const keys = studentEntitlements.filter(
            (entry) =>
              entry.user_id === student.user_id &&
              (!entry.expires_at || Date.parse(entry.expires_at) > Date.now()),
          );
          return (
            <article className="academy-admin__student" key={student.user_id}>
              <div>
                <strong>{student.display_name}</strong>
                <span>{student.email}</span>
              </div>
              <div className="academy-admin__badges">
                {keys.map((entry) => (
                  <span key={entry.entitlement_key}>
                    {entry.entitlement_key}
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() =>
                        void onRevoke(student.user_id, entry.entitlement_key)
                      }
                      aria-label={`Revoke ${entry.entitlement_key} from ${student.email}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {!keys.length && (
                  <small>{copy("No active access", "কোনো active access নেই")}</small>
                )}
              </div>
            </article>
          );
        })}

        {filteredStudents.length === 0 && (
          <p className="academy-admin__empty">
            {copy("No matching learner accounts.", "কোনো matching learner পাওয়া যায়নি।")}
          </p>
        )}
      </div>

      {/* Curriculum Inspector + Cohort Studio Notice */}
      <div className="academy-admin__tools">
        <div className="academy-admin__tool-card">
          <h4>
            <BookOpen size={15} />{" "}
            {copy("Quick Curriculum Jump", "দ্রুত Lesson পরিদর্শন")}
          </h4>
          <p>
            {copy(
              "Inspect any lesson day directly inside the learning workspace.",
              "যেকোনো দিনের lesson সরাসরি পরীক্ষা করো।",
            )}
          </p>
          <div className="academy-admin__day-pills">
            {academyDays.map((d) => (
              <button
                key={d.day}
                type="button"
                onClick={() => onInspectDay(d.day)}
              >
                {String(d.day).padStart(2, "0")}
              </button>
            ))}
          </div>
        </div>

        <form className="academy-admin__tool-card" onSubmit={saveAnnouncement}>
          <h4>
            <Megaphone size={15} />{" "}
            {copy("Studio Notice Board", "স্টুডিও নোটিশ বোর্ড")}
          </h4>
          <p>
            {copy(
              "Pin a brief guidance note inside the Academy header (browser-local studio draft).",
              "Academy-তে প্রদর্শনের জন্য সংক্ষিপ্ত নির্দেশনা সংরক্ষণ করো।",
            )}
          </p>
          <textarea
            rows={2}
            maxLength={240}
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder={copy("e.g. Week 2 Memory Lab starts Friday evening.", "যেমন: এই শুক্রবার মেমোরি ল্যাব শুরু।")}
          />
          <div className="academy-admin__tool-actions">
            <button type="submit" className="academy-outline-button">
              {copy("Save Studio Note", "নোটিশ সেভ করো")}
            </button>
            {announcementSaved && (
              <span className="academy-form-success">
                {copy("Saved", "সেভ হয়েছে")}
              </span>
            )}
          </div>
        </form>
      </div>

      <p className="academy-admin__security">
        {copy(
          "Security: only the verified owner identity can grant/revoke entitlements. Learner-side client code cannot write XP, completion rows, or entitlements directly.",
          "Security: শুধু verified owner grant/revoke করতে পারেন। Learner-side client code সরাসরি XP বা entitlement লিখতে পারে না।",
        )}
      </p>
    </section>
  );
}
