import { useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, MapPin, MessageCircle } from "lucide-react";
import { siteIdentity } from "../../data/site";

type FormState = "idle" | "sending" | "success" | "error";

export function ContactSanctuarySection() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formMessage, setFormMessage] = useState("");

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("sending");
    setFormMessage("");
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = {
      name: String(values.get("name") ?? ""),
      email: String(values.get("email") ?? ""),
      subject: String(values.get("subject") ?? ""),
      message: String(values.get("message") ?? ""),
      website: String(values.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          "The contact service is currently unavailable. Please email Zeehad directly.",
        );
      }
      const result = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(result.message ?? "The message could not be sent.");
      }
      setFormState("success");
      setFormMessage("Your inquiry has been received. Thank you.");
      form.reset();
    } catch (error) {
      setFormState("error");
      setFormMessage(
        error instanceof Error
          ? error.message
          : "The message could not be sent.",
      );
    }
  };

  return (
    <section
      className="dest dest-contact"
      id="grand-exit"
      aria-labelledby="contact-monolith-title"
    >
      <span id="contact" className="anchor-alias" aria-hidden="true" />

      <div className="castle-shell contact-sanctuary">
        <div className="contact-sanctuary__info">
          <p className="identity-kicker">07 · The Grand Exit · Correspondence</p>
          <h2 id="contact-monolith-title">
            Step beyond the threshold. <em>Begin a film.</em>
          </h2>
          <p className="contact-sanctuary__lead">
            For independent productions, directing inquiries, creative
            collaborations, or thoughtful conversations about cinema.
          </p>

          <div className="contact-sanctuary__channels">
            <a href={`mailto:${siteIdentity.email}`}>
              <Mail size={16} />
              <div>
                <small>Direct Email</small>
                <strong>{siteIdentity.email}</strong>
              </div>
              <ArrowUpRight size={15} className="channel-arrow" />
            </a>

            <a
              href="https://wa.me/8801629851155"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} />
              <div>
                <small>WhatsApp Studio Line</small>
                <strong>{siteIdentity.whatsapp}</strong>
              </div>
              <ArrowUpRight size={15} className="channel-arrow" />
            </a>

            <div className="contact-sanctuary__location">
              <MapPin size={16} />
              <div>
                <small>Studio Base</small>
                <strong>{siteIdentity.location}</strong>
              </div>
            </div>
          </div>
        </div>

        <form className="contact-console" onSubmit={submitContact}>
          <div className="contact-console__head">
            <span>Grand Exit Transmission</span>
            <span className="tabular-nums">POST /api/contact</span>
          </div>

          <label>
            <span>Your Name</span>
            <input
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              placeholder="How should I address you?"
            />
          </label>
          <label>
            <span>Email Address</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={200}
              placeholder="you@example.com"
            />
          </label>
          <label>
            <span>Subject</span>
            <input
              name="subject"
              type="text"
              maxLength={160}
              placeholder="Production · Collaboration · Cinema"
            />
          </label>
          <label>
            <span>Message</span>
            <textarea
              name="message"
              rows={4}
              required
              maxLength={4000}
              placeholder="Tell me a little about the story, timeline, or idea…"
            />
          </label>
          <label className="contact-console__trap" aria-hidden="true">
            <span>Website</span>
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>

          <div className="contact-console__actions">
            <button
              type="submit"
              className="identity-btn identity-btn--primary"
              disabled={formState === "sending"}
            >
              <span>
                {formState === "sending" ? "Sending…" : "Send Message"}
              </span>
              <ArrowUpRight size={15} />
            </button>
            {formMessage && (
              <p
                role="status"
                aria-live="polite"
                className={`contact-console__status is-${formState}`}
              >
                {formMessage}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
