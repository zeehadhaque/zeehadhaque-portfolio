import React, { useState } from "react";

export interface AcademyStudentProfile {
  name: string;
  phone: string;
  age: number;
  primaryInterest: string;
  experienceLevel: string;
  enquiryGoal: string;
}

export interface AcademyEmailAuthPayload {
  mode: "login" | "signup";
  email: string;
  password: string;
  profile?: AcademyStudentProfile;
}

interface AcademyAuthGateProps {
  language?: "en" | "bn";
  onToggleLanguage?: () => void;
  onEmailAuth: (payload: AcademyEmailAuthPayload) => Promise<void>;
  onGoogleAuth: () => Promise<void>;
  needsProfileCompletion?: boolean;
  prefillEmail?: string;
  prefillName?: string;
  onCompleteProfile?: (profile: AcademyStudentProfile) => Promise<void>;
  onClose?: () => void;
}

const INTEREST_OPTIONS = [
  { value: "complete-filmmaking", en: "Complete Filmmaking (Zero to Pro)", bn: "সম্পূর্ণ ফিল্মমেকিং (জিরো টু প্রো)" },
  { value: "direction", en: "Film Direction & Storytelling", bn: "ডিরেকশন ও স্টোরিটেলিং" },
  { value: "screenwriting", en: "Story, Screenplay & Proper Script", bn: "গল্প, স্ক্রিনপ্লে ও প্রোপার স্ক্রিপ্ট" },
  { value: "cinematography", en: "Cinematography, Framing & Light", bn: "সিনেমাটোগ্রাফি, ফ্রেমিং ও লাইটিং" },
  { value: "editing-sound", en: "Editing, Rhythm & Sound Design", bn: "এডিটিং, রিদম ও সাউন্ড ডিজাইন" },
];

const LEVEL_OPTIONS = [
  { value: "beginner", en: "Absolute Beginner (Starting from Zero)", bn: "একদম নতুন (শূন্য থেকে শুরু)" },
  { value: "mobile-creator", en: "Mobile Filmmaker / Content Creator", bn: "মোবাইল ফিল্মমেকার / ক্রিয়েটর" },
  { value: "indie", en: "Indie Filmmaker / Short Film Maker", bn: "ইন্ডি / শর্ট ফিল্ম মেকার" },
];

const GoogleIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.3-2 3l3.2 2.5c1.9-1.7 3-4.3 3-7.4 0-.7-.1-1.4-.2-2H12z"
    />
    <path
      fill="#34A853"
      d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1l-3.3 2.5C4.8 19.7 8.1 22 12 22z"
    />
    <path
      fill="#4A90E2"
      d="M6.4 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9L3.1 7.6C2.4 9 2 10.4 2 12s.4 3 1.1 4.4l3.3-2.5z"
    />
    <path
      fill="#FBBC05"
      d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8C17 3 14.7 2 12 2 8.1 2 4.8 4.3 3.1 7.6l3.3 2.5C7.2 7.7 9.4 5.9 12 5.9z"
    />
  </svg>
);

export const AcademyAuthGate: React.FC<AcademyAuthGateProps> = ({
  language = "en",
  onToggleLanguage,
  onEmailAuth,
  onGoogleAuth,
  needsProfileCompletion = false,
  prefillEmail = "",
  prefillName = "",
  onCompleteProfile,
  onClose,
}) => {
  const isBn = language === "bn";
  const [mode, setMode] = useState<"login" | "signup">("login");

  // Credentials
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");

  // Professional Student Details & Enquiries
  const [name, setName] = useState(prefillName);
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [primaryInterest, setPrimaryInterest] = useState("complete-filmmaking");
  const [experienceLevel, setExperienceLevel] = useState("beginner");
  const [enquiryGoal, setEnquiryGoal] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const validateProfile = (): AcademyStudentProfile | null => {
    if (name.trim().length < 2) {
      setError(isBn ? "আপনার পুরো নাম লিখুন।" : "Please enter your full name.");
      return null;
    }
    const cleanPhone = phone.replace(/[^\d+]/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      setError(
        isBn
          ? "সঠিক মোবাইল বা হোয়াটসঅ্যাপ নাম্বার দিন (যেমন: 01XXXXXXXXX)।"
          : "Please enter a valid phone or WhatsApp number."
      );
      return null;
    }
    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge) || parsedAge < 10 || parsedAge > 90) {
      setError(isBn ? "সঠিক বয়স লিখুন (১০–৯০)।" : "Please enter a valid age (10–90).");
      return null;
    }
    if (enquiryGoal.trim().length < 5) {
      setError(
        isBn
          ? "আপনি কী ধরনের সিনেমা বানাতে বা শিখতে চান তা সংক্ষেপে লিখুন।"
          : "Briefly share what kind of film or skill you want to master."
      );
      return null;
    }

    return {
      name: name.trim(),
      phone: cleanPhone,
      age: parsedAge,
      primaryInterest,
      experienceLevel,
      enquiryGoal: enquiryGoal.trim(),
    };
  };

  const handleGoogleClick = async () => {
    setError(null);
    setNotice(null);
    try {
      setGoogleLoading(true);
      await onGoogleAuth();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isBn
          ? "Google লগইন চালু করা যায়নি। আবার চেষ্টা করুন।"
          : "Could not start Google sign-in. Please try again."
      );
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    // Step for Google-authenticated users missing phone/age/enquiry
    if (needsProfileCompletion) {
      const profile = validateProfile();
      if (!profile || !onCompleteProfile) return;
      try {
        setSubmitting(true);
        await onCompleteProfile(profile);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : isBn
            ? "প্রোফাইল সেভ করা যায়নি।"
            : "Could not save your student profile."
        );
      } finally {
        setSubmitting(false);
      }
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError(isBn ? "সঠিক ইমেইল ঠিকানা লিখুন।" : "Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError(
        isBn
          ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"
          : "Password must be at least 6 characters."
      );
      return;
    }

    let profile: AcademyStudentProfile | undefined;
    if (mode === "signup") {
      const valid = validateProfile();
      if (!valid) return;
      profile = valid;
    }

    try {
      setSubmitting(true);
      await onEmailAuth({
        mode,
        email: cleanEmail,
        password,
        profile,
      });
      if (mode === "signup") {
        setNotice(
          isBn
            ? "রেজিস্ট্রেশন সম্পন্ন! ইমেইল ভেরিফিকেশন লিংক থাকলে ইনবক্স চেক করুন অথবা সরাসরি প্রবেশ করুন।"
            : "Registration complete! Check your inbox if verification is enabled, or enter directly."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isBn
          ? "লগইন সম্পন্ন হয়নি। ইমেইল ও পাসওয়ার্ড আবার যাচাই করুন।"
          : "Authentication failed. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="academy-auth-wrap">
      <div className="academy-auth-topbar">
        <span className="academy-kicker" style={{ marginBottom: 0 }}>
          ZEE FILMMAKING INSTITUTE // {needsProfileCompletion ? "STUDENT PASS SETUP" : "MEMBER ACCESS"}
        </span>

        <div className="academy-auth-top-actions">
          {onToggleLanguage && (
            <button type="button" className="vf-pill-btn" onClick={onToggleLanguage}>
              {isBn ? "English" : "বাংলা"}
            </button>
          )}
          {onClose && (
            <button type="button" className="vf-pill-btn" onClick={onClose}>
              {isBn ? "বন্ধ ✕" : "Close ✕"}
            </button>
          )}
        </div>
      </div>

      <div className="academy-auth-grid">
        {/* Left: Cinema Academy Value Pitch */}
        <div className="academy-auth-pitch">
          <span className="academy-auth-lock-badge">
            🔒 {needsProfileCompletion
              ? isBn
                ? "শেষ ধাপ · প্রোফাইল সম্পূর্ণ করুন"
                : "FINAL STEP · COMPLETE STUDENT PASS"
              : isBn
              ? "লগইন বাধ্যতামূলক"
              : "STUDENT LOGIN REQUIRED"}
          </span>

          <h2 className="academy-title" style={{ marginTop: 10 }}>
            {isBn ? "জিরো থেকে প্রো ফিল্মমেকিং একাডেমি" : "Zero-to-Pro Filmmaking Institute"}
          </h2>

          <p className="academy-subtitle">
            {isBn
              ? "Google অথবা ইমেইল দিয়ে অ্যাকাউন্ট করে ৩০ দিনের কোর্স, লাইভ ভিউফাইন্ডার ল্যাব, প্রোপার স্ক্রিপ্ট স্টুডিও এবং Cine-Arcade গেমস আনলক করুন।"
              : "Sign in with Google or Email to unlock the 30-Day Auteur Curriculum, Live Viewfinder Lab, Story-to-Script Studio, and playable Cine-Arcade."}
          </p>

          <ul className="academy-auth-perks">
            <li>
              <strong>30-Day Auteur Curriculum + Live Viewfinder</strong>
              <span>
                {isBn
                  ? "ফ্রেমিং, লেন্স, লাইটিং, ডিরেকশন ও সাউন্ড হাতে-কলমে শেখা"
                  : "Hands-on framing, focal length, lighting & direction practice"}
              </span>
            </li>
            <li>
              <strong>Idea → Concept → Proper Script Studio</strong>
              <span>
                {isBn
                  ? "আইডিয়া থেকে প্রোপার হলিউড স্ক্রিনপ্লে তৈরি ও এক্সপোর্ট"
                  : "Build & export industry-standard screenplays step-by-step"}
              </span>
            </li>
            <li>
              <strong>Cine-Arcade Games & Personal Progress Sync</strong>
              <span>
                {isBn
                  ? "খেলতে খেলতে ফিল্মমেকিং শিখুন — আপনার XP ও র্যাঙ্ক সংরক্ষিত থাকবে"
                  : "Master editing, script & lighting via games with saved XP & ranks"}
              </span>
            </li>
          </ul>
        </div>

        {/* Right: Frosted Glass Auth & Professional Intake Form */}
        <form className="academy-auth-card" onSubmit={handleSubmit} noValidate>
          {!needsProfileCompletion && (
            <>
              <div className="academy-segmented" style={{ alignSelf: "stretch", justifyContent: "center" }}>
                <button
                  type="button"
                  className="academy-seg-btn"
                  data-active={mode === "login"}
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                >
                  {isBn ? "সাইন ইন" : "Sign In"}
                </button>
                <button
                  type="button"
                  className="academy-seg-btn"
                  data-active={mode === "signup"}
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                >
                  {isBn ? "সাইন আপ" : "Sign Up"}
                </button>
              </div>

              <button
                type="button"
                className="academy-google-btn"
                disabled={googleLoading || submitting}
                onClick={handleGoogleClick}
              >
                <GoogleIcon />
                <span>
                  {googleLoading
                    ? isBn
                      ? "Google-এ সংযোগ হচ্ছে..."
                      : "Connecting to Google..."
                    : isBn
                    ? "Google দিয়ে চালিয়ে যান"
                    : "Continue with Google"}
                </span>
              </button>

              <div className="academy-auth-divider">
                <span>{isBn ? "অথবা ইমেইল দিয়ে" : "OR WITH EMAIL"}</span>
              </div>
            </>
          )}

          {/* Professional Intake Fields (Shown on Sign Up OR Google Profile Completion) */}
          {(mode === "signup" || needsProfileCompletion) && (
            <>
              <label className="script-field">
                <span className="script-field-label">{isBn ? "পূর্ণ নাম *" : "Full Name *"}</span>
                <input
                  type="text"
                  className="script-input"
                  placeholder={isBn ? "আপনার পুরো নাম" : "Your full name"}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <div className="academy-form-row">
                <label className="script-field">
                  <span className="script-field-label">
                    {isBn ? "মোবাইল / হোয়াটসঅ্যাপ *" : "Phone / WhatsApp *"}
                  </span>
                  <input
                    type="tel"
                    className="script-input"
                    placeholder="01XXXXXXXXX"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </label>

                <label className="script-field">
                  <span className="script-field-label">{isBn ? "বয়স *" : "Age *"}</span>
                  <input
                    type="number"
                    min={10}
                    max={90}
                    className="script-input"
                    placeholder="20"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </label>
              </div>
            </>
          )}

          {/* Email & Password (Hidden if already authenticated via Google) */}
          {!needsProfileCompletion && (
            <div className={mode === "signup" ? "academy-form-row" : "academy-form-stack"}>
              <label className="script-field">
                <span className="script-field-label">{isBn ? "ইমেইল *" : "Email Address *"}</span>
                <input
                  type="email"
                  className="script-input"
                  placeholder="filmmaker@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="script-field">
                <span className="script-field-label">{isBn ? "পাসওয়ার্ড *" : "Password *"}</span>
                <input
                  type="password"
                  className="script-input"
                  placeholder="Min 6 chars"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            </div>
          )}

          {/* 2 Quick Professional Filmmaking Enquiry Questions */}
          {(mode === "signup" || needsProfileCompletion) && (
            <>
              <div className="academy-form-row">
                <label className="script-field">
                  <span className="script-field-label">
                    {isBn ? "আপনার মূল আগ্রহ *" : "Primary Craft Focus *"}
                  </span>
                  <select
                    className="script-input academy-select"
                    value={primaryInterest}
                    onChange={(e) => setPrimaryInterest(e.target.value)}
                  >
                    {INTEREST_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {isBn ? opt.bn : opt.en}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="script-field">
                  <span className="script-field-label">
                    {isBn ? "বর্তমান অভিজ্ঞতা *" : "Experience Level *"}
                  </span>
                  <select
                    className="script-input academy-select"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    {LEVEL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {isBn ? opt.bn : opt.en}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="script-field">
                <span className="script-field-label">
                  {isBn
                    ? "একাডেমি থেকে কী শিখতে বা কেমন ফিল্ম বানাতে চান? *"
                    : "What kind of film or skill do you want to master here? *"}
                </span>
                <textarea
                  className="script-textarea"
                  rows={2}
                  placeholder={
                    isBn
                      ? "যেমন: মোবাইল দিয়ে শর্ট ফিল্ম ডিরেকশন ও প্রোপার স্ক্রিপ্ট লেখা শিখতে চাই..."
                      : "e.g., I want to write my first psychological thriller script and shoot on mobile..."
                  }
                  value={enquiryGoal}
                  onChange={(e) => setEnquiryGoal(e.target.value)}
                  required
                />
              </label>
            </>
          )}

          {error && <div className="arcade-feedback arcade-feedback--bad">{error}</div>}
          {notice && <div className="arcade-feedback arcade-feedback--ok">{notice}</div>}

          <button
            type="submit"
            className="studio-cta-btn studio-cta-btn--lg"
            disabled={submitting || googleLoading}
            style={{ width: "100%" }}
          >
            {submitting
              ? isBn
                ? "যাচাই হচ্ছে..."
                : "Processing..."
              : needsProfileCompletion
              ? isBn
                ? "স্টুডেন্ট পাস সেভ করে প্রবেশ করুন →"
                : "Save Profile & Enter Academy →"
              : mode === "login"
              ? isBn
                ? "একাডেমিতে সাইন ইন করুন →"
                : "Sign In to Academy →"
              : isBn
              ? "অ্যাকাউন্ট তৈরি করে প্রবেশ করুন →"
              : "Create Student Account →"}
          </button>
        </form>
      </div>
    </div>
  );
};
