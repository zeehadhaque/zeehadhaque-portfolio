import { useState, type FormEvent } from "react";
import { siteIdentity } from "../../data/site";

type FormState = "idle" | "sending" | "success" | "error";

export function ContactSection() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormState("sending");
    setStatusMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const contentType = response.headers.get("content-type") ?? "";
      if (!contentType.includes("application/json")) {
        throw new Error("Contact service is not configured yet. Please email Zeehad directly.");
      }
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message ?? "The message could not be sent.");
      setFormState("success");
      setStatusMessage("Your message has been received. Thank you.");
      form.reset();
    } catch (error) {
      setFormState("error");
      setStatusMessage(error instanceof Error ? error.message : "The message could not be sent.");
    }
  };

  return (
    <section className="contact section-dark" id="contact" aria-labelledby="contact-title">
      <div className="page-width">
        <div className="contact__intro">
          <p className="section-kicker">07 / Final contact</p>
          <h2 id="contact-title">Let's create something <em>meaningful.</em></h2>
          <p>For a film, a visual collaboration or a conversation about the work.</p>
        </div>
        <div className="contact__grid">
          <div className="contact__details">
            <div><span className="contact__label">Write to</span><a href={`mailto:${siteIdentity.email}`}>{siteIdentity.email}</a></div>
            <div><span className="contact__label">WhatsApp</span><a href="https://wa.me/8801629851155" target="_blank" rel="noreferrer">{siteIdentity.whatsapp}</a></div>
            <div><span className="contact__label">Based in</span><span>{siteIdentity.location}</span></div>
          </div>
          <form className="contact-form" onSubmit={submitContact}>
            <label><span>Name</span><input name="name" type="text" autoComplete="name" required maxLength={100} /></label>
            <label><span>Email</span><input name="email" type="email" autoComplete="email" required maxLength={200} /></label>
            <label><span>Subject</span><input name="subject" type="text" maxLength={160} /></label>
            <label><span>Message</span><textarea name="message" rows={4} required maxLength={4000} /></label>
            <label className="contact-form__honeypot" aria-hidden="true"><span>Website</span><input name="website" tabIndex={-1} autoComplete="off" /></label>
            <div className="contact-form__submit"><button className="submit-button" type="submit" disabled={formState === "sending"}>{formState === "sending" ? "Sending…" : "Send message ↗"}</button><p role="status" aria-live="polite" className={`form-status form-status--${formState}`}>{statusMessage}</p></div>
          </form>
        </div>
        <div className="section-tail section-tail--light"><span>CONTACT</span><span>Open for meaningful work</span></div>
      </div>
    </section>
  );
}
