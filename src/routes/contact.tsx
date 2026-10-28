import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { sendContactMessage } from "@/lib/contact.functions";
import { contact, pageMeta } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => pageMeta("Contact Us", "Call, email or send GSWAU a message. We read every message."),
  component: Contact,
});

const field = "mt-1 w-full rounded-md border border-input bg-background px-4 py-3 text-base";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <InfoPage eyebrow="The Company" title="Contact Us">
      <p>
        Questions about the audiobooks, courses or membership? Get in touch and we will reply as
        soon as we can.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href={contact.phoneHref}
          className="rounded-lg border border-border bg-card p-5 !no-underline shadow-card"
        >
          <div className="eyebrow text-crimson">Phone</div>
          <div className="mt-2 text-xl font-semibold text-foreground">{contact.phone}</div>
        </a>
        <a
          href={`mailto:${contact.email}`}
          className="rounded-lg border border-border bg-card p-5 !no-underline shadow-card"
        >
          <div className="eyebrow text-crimson">Email</div>
          <div className="mt-2 break-all text-xl font-semibold text-foreground">
            {contact.email}
          </div>
        </a>
      </div>

      <h2>Send us a message</h2>
      {state === "done" ? (
        <p role="status" className="rounded-md bg-secondary p-5 font-semibold">
          Thank you, your message has been sent. We will reply by email.
        </p>
      ) : (
        <form
          className="mt-4 grid gap-4 text-base"
          onSubmit={async (e) => {
            e.preventDefault();
            setState("sending");
            try {
              await sendContactMessage({ data: form });
              setState("done");
            } catch {
              setState("error");
            }
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              Your name
              <input
                required
                maxLength={100}
                autoComplete="name"
                value={form.name}
                onChange={set("name")}
                className={field}
              />
            </label>
            <label>
              Your email
              <input
                required
                type="email"
                maxLength={255}
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                className={field}
              />
            </label>
          </div>
          <label>
            Subject <span className="text-muted-foreground">(optional)</span>
            <input
              maxLength={150}
              value={form.subject}
              onChange={set("subject")}
              className={field}
            />
          </label>
          <label>
            Message
            <textarea
              required
              rows={6}
              maxLength={5000}
              value={form.message}
              onChange={set("message")}
              className={field}
            />
          </label>
          {/* Hidden from people; catches bots that fill in every field. */}
          <input
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={form.website}
            onChange={set("website")}
            className="hidden"
            name="website"
          />
          <div>
            <button className="btn-gold" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send message"}
            </button>
          </div>
          {state === "error" && (
            <p role="alert" className="text-crimson">
              Your message could not be sent. Please try again, or email us at {contact.email}.
            </p>
          )}
        </form>
      )}
    </InfoPage>
  );
}
