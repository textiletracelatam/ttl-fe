"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

export default function AppDialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: (open: false) => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onClose={() => onClose(false)} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-neutral-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:bg-neutral-900/50"
      />

      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative w-full max-w-lg transform rounded-lg bg-white px-6 pt-6 pb-5 text-left shadow-xl transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:p-8 dark:bg-neutral-800 dark:outline dark:-outline-offset-1 dark:outline-white/10"
        >
          {title && (
            <DialogTitle
              as="h3"
              className="text-center font-serif text-xl sm:text-2xl font-medium text-neutral-900 dark:text-white whitespace-pre-line"
            >
              {title}
            </DialogTitle>
          )}
          <div className={title ? "mt-4" : ""}>{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
