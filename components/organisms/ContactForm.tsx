"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cinematicEase } from "@/lib/motion/variants";

type ContactFormProps = {
  labels: {
    name: string;
    email: string;
    message: string;
    submit: string;
    sending: string;
    sendingDetail: string;
    successTitle: string;
    successDetail: string;
    sendAgain: string;
    errorGeneric: string;
    errorValidation: string;
    errorConfig: string;
  };
};

type FormStatus = "idle" | "sending" | "success" | "error";

const ERROR_MESSAGES: Record<string, keyof ContactFormProps["labels"]> = {
  NAME_TOO_SHORT: "errorValidation",
  INVALID_EMAIL: "errorValidation",
  MESSAGE_TOO_SHORT: "errorValidation",
  EMAIL_NOT_CONFIGURED: "errorConfig",
};

const overlayTransition = {
  duration: 0.4,
  ease: cinematicEase,
};

function LoadingOverlay({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={overlayTransition}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ivory-100/95 px-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1 w-10 bg-gold-500"
            animate={{ opacity: [0.35, 1, 0.35], scaleY: [0.6, 1, 0.6] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <p className="mt-8 font-display text-lg font-bold text-navy-950">
        {title}
      </p>
      <p className="mt-2 font-sans text-sm text-navy-800/75">{detail}</p>
    </motion.div>
  );
}

function SuccessOverlay({
  title,
  detail,
  sendAgainLabel,
  onSendAgain,
}: {
  title: string;
  detail: string;
  sendAgainLabel: string;
  onSendAgain: () => void;
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={overlayTransition}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ivory-100 px-8 text-center"
      role="status"
      aria-live="polite"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: cinematicEase, delay: 0.1 }}
        className="flex h-14 w-14 items-center justify-center border-2 border-gold-500 bg-navy-950"
        aria-hidden
      >
        <motion.svg
          viewBox="0 0 24 24"
          className="h-7 w-7 text-gold-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: cinematicEase, delay: 0.35 }}
        >
          <motion.path
            strokeLinecap="square"
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: cinematicEase, delay: 0.45 }}
        className="mt-8 font-display text-xl font-bold tracking-tight text-navy-950 md:text-2xl"
      >
        {title}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: cinematicEase, delay: 0.55 }}
        className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-navy-800/80"
      >
        {detail}
      </motion.p>
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75, duration: 0.35 }}
        onClick={onSendAgain}
        className="mt-8 border border-gold-500 bg-navy-950 px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-gold-500 transition-colors hover:bg-gold-500 hover:text-navy-950"
      >
        {sendAgainLabel}
      </motion.button>
    </motion.div>
  );
}

export function ContactForm({ labels }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const isBusy = status === "sending" || status === "success";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorKey(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });

      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setErrorKey(json.error ?? "SEND_FAILED");
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setErrorKey("SEND_FAILED");
      setStatus("error");
    }
  }

  const errorMessage =
    status === "error"
      ? errorKey && ERROR_MESSAGES[errorKey]
        ? labels[ERROR_MESSAGES[errorKey]]
        : labels.errorGeneric
      : null;

  const fieldClass =
    "box-border w-full border border-navy-800 bg-ivory-50 px-4 py-3 font-sans text-navy-950 outline-none focus:border-gold-500 disabled:opacity-60";

  return (
    <div className="relative mt-0 box-border w-full min-h-[420px] self-start border border-navy-800 bg-ivory-100">
      <form
        className={`box-border w-full p-8 transition-opacity duration-300 ${
          isBusy ? "pointer-events-none opacity-40" : ""
        }`}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          aria-hidden
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex min-w-0 flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
              {labels.name}
            </span>
            <input
              type="text"
              name="name"
              required
              minLength={2}
              maxLength={120}
              disabled={isBusy}
              className={fieldClass}
            />
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
              {labels.email}
            </span>
            <input
              type="email"
              name="email"
              required
              maxLength={254}
              disabled={isBusy}
              className={fieldClass}
            />
          </label>
        </div>

        <label className="mt-4 flex w-full flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-navy-800">
            {labels.message}
          </span>
          <textarea
            name="message"
            rows={5}
            required
            minLength={10}
            maxLength={5000}
            disabled={isBusy}
            className={`${fieldClass} resize-y`}
          />
        </label>

        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isBusy}
            className="box-border shrink-0 border border-gold-500 bg-navy-950 px-8 py-3 font-mono text-xs uppercase tracking-widest text-gold-500 transition-colors hover:bg-gold-500 hover:text-navy-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {labels.submit}
          </button>
          {errorMessage ? (
            <p className="font-mono text-xs text-red-800" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </form>

      <AnimatePresence mode="wait">
        {status === "sending" ? (
          <LoadingOverlay
            title={labels.sending}
            detail={labels.sendingDetail}
          />
        ) : null}
        {status === "success" ? (
          <SuccessOverlay
            title={labels.successTitle}
            detail={labels.successDetail}
            sendAgainLabel={labels.sendAgain}
            onSendAgain={() => setStatus("idle")}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
