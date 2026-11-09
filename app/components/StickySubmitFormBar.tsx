"use client";

import { useTranslations } from "next-intl";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface StickySubmitBarProps {
  status: SubmitStatus;
  statusMessage: string;
  /** Defaults to the translated "Submit passport" when omitted. */
  submitLabel?: string;
}

export default function StickySubmitFormBar({
  status,
  statusMessage,
  submitLabel,
}: StickySubmitBarProps) {
  const translation = useTranslations("admin.submitBar");

  return (
    <div className="sticky bottom-0 mt-8 -mx-6 border-t border-neutral-200 bg-neutral-50/95 px-6 py-4 backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95">
      <div className="flex items-center justify-between gap-4">
        <div className="text-xs">
          {status === "success" && <span className="font-medium text-green-600 dark:text-green-400">{statusMessage}</span>}
          {status === "error" && <span className="font-medium text-red-600 dark:text-red-400">{statusMessage}</span>}
          {status === "idle" && <span className="text-neutral-500 dark:text-neutral-400">{translation("idleHint")}</span>}
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-md bg-primary-500 px-5 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-600 dark:shadow-none dark:hover:bg-primary-500"
        >
          {status === "submitting"
            ? translation("submitting")
            : submitLabel ?? translation("submitPassport")}
        </button>
      </div>
    </div>
  );
}