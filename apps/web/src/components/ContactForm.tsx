"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/contact/actions";

const inputClass =
  "w-full rounded-md border border-black/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-burgundy/50 focus:outline-none focus:ring-2 focus:ring-burgundy/10";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
      {pending ? "Sending…" : "Send Message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, action] = useFormState<ContactState, FormData>(
    submitContact,
    null
  );

  if (state?.ok) {
    return (
      <div className="rounded-lg border border-burgundy/20 bg-cream p-8 text-center">
        <h3 className="font-serif text-2xl text-burgundy">Thank you!</h3>
        <p className="mt-3 text-sm text-ink/75">
          Your message has been received. Our team will be in touch with you
          shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Your name" className={inputClass} />
        <input
          name="email"
          type="email"
          required
          placeholder="Email address"
          className={inputClass}
        />
      </div>
      <input name="phone" placeholder="Phone (optional)" className={inputClass} />
      <textarea
        name="message"
        required
        rows={5}
        placeholder="How can we help you?"
        className={inputClass}
      />
      {state?.error && (
        <p className="text-sm text-burgundy">{state.error}</p>
      )}
      <SubmitButton />
    </form>
  );
}
