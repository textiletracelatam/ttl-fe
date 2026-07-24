"use client";

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface StickySubmitBarProps {
  status: SubmitStatus;
  statusMessage: string;
  submitLabel?: string;
}

export default function StickySubmitFormBar({
  status,
  statusMessage,
  submitLabel = "Submit passport",
}: StickySubmitBarProps) {
  return (
    <div className="sticky bottom-0 mt-8 -mx-6 border-t border-slate-200 bg-slate-50/95 px-6 py-4 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="text-xs">
          {status === "success" && <span className="font-medium text-emerald-600">{statusMessage}</span>}
          {status === "error" && <span className="font-medium text-red-600">{statusMessage}</span>}
          {status === "idle" && <span className="text-slate-500">All fields save locally until you submit.</span>}
        </div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-md bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "submitting" ? "Submitting…" : submitLabel}
        </button>
      </div>
    </div>
  );
}