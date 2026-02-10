"use client";

import DetailPageLayout from "@/app/components/DetailPageLayout";
import { useCertifications } from "@/app/hooks/useCertifications";

export default function CertificationsPage() {
  const certifications = useCertifications();

  return (
    <DetailPageLayout title="Certifications">
      <div className="space-y-4">
        {certifications.map((cert) => (
          <div
            key={cert.name}
            className="rounded-2xl bg-neutral-100 dark:bg-neutral-800 p-5 sm:p-6"
          >
            {/* Header: name + status */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  {cert.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {cert.issuer}
                </p>
              </div>
              <span
                className={`shrink-0 mt-0.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  cert.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {cert.status === "active" ? "Active" : "Expired"}
              </span>
            </div>

            {/* Description */}
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {cert.description}
            </p>

            {/* Footer: scope + valid until */}
            <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
              <span className="inline-flex items-center rounded-md bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 font-medium">
                {cert.scope}
              </span>
              <span>
                Valid until{" "}
                {new Date(cert.validUntil).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DetailPageLayout>
  );
}
