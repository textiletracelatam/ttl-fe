"use client";

import { useTranslations } from "next-intl";
import {
  TABLE_SCHEMA,
  TABLE_SCHEMA_BY_ID,
  depthOf,
} from "@/app/lib/dppFormSchema";

interface SideNavProps {
  activeSection: string;
  sectionsWithErrors: Set<string>;
  onNavigate: (tableId: string) => void;
  /**
   * Number of entries currently filled in for each collection table
   * (isCollection: true), keyed by table id. Non-collection tables can be
   * omitted; they're always treated as a single entry.
   */
  entryCounts?: Record<string, number>;
}

export default function SideNav({
  activeSection,
  sectionsWithErrors,
  onNavigate,
  entryCounts = {},
}: SideNavProps) {
  const translation = useTranslations("admin.sideNav");

  return (
    <aside className="sticky top-10 hidden h-fit w-64 shrink-0 lg:block">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        {translation("heading")}
      </h2>
      <p className="mb-4 text-xs text-neutral-500 dark:text-neutral-400">
        {translation("sectionsCount", { count: TABLE_SCHEMA.length })}
      </p>
      <nav className="flex flex-col gap-0.5">
        {TABLE_SCHEMA.map((table) => {
          const depth = depthOf(table.id, TABLE_SCHEMA_BY_ID);
          const hasError = sectionsWithErrors.has(table.id);
          const isActive = activeSection === table.id;
          const count = table.isCollection ? entryCounts[table.id] : undefined;
          return (
            <button
              key={table.id}
              type="button"
              onClick={() => onNavigate(table.id)}
              style={{ paddingLeft: `${12 + depth * 16}px` }}
              className={[
                "flex items-center justify-between rounded-md py-1.5 pr-3 text-left text-sm transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                  : "text-neutral-600 hover:bg-neutral-200/70 dark:text-neutral-300 dark:hover:bg-neutral-700/50",
              ].join(" ")}
            >
              <span className="truncate">{table.label}</span>
              <span className="ml-2 flex shrink-0 items-center gap-1.5">
                {count !== undefined && (
                  <span
                    className={[
                      "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                      isActive
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-800/40 dark:text-primary-200"
                        : "bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300",
                    ].join(" ")}
                  >
                    {count}
                  </span>
                )}
                {hasError && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500 dark:bg-red-400" />
                )}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
