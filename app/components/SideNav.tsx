"use client";

import { TABLE_SCHEMA, TABLE_SCHEMA_BY_ID, depthOf } from "@/app/lib/dpp-form-schema";

interface SideNavProps {
  activeSection: string;
  sectionsWithErrors: Set<string>;
  onNavigate: (tableId: string) => void;
}

export default function SideNav({ activeSection, sectionsWithErrors, onNavigate }: SideNavProps) {
  return (
    <aside className="sticky top-10 hidden h-fit w-64 shrink-0 lg:block">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Digital Product Passport
      </h2>
      <p className="mb-4 text-xs text-slate-500">{TABLE_SCHEMA.length} sections · {TABLE_SCHEMA.length} tables</p>
      <nav className="flex flex-col gap-0.5">
        {TABLE_SCHEMA.map((table) => {
          const depth = depthOf(table.id, TABLE_SCHEMA_BY_ID);
          const hasError = sectionsWithErrors.has(table.id);
          const isActive = activeSection === table.id;
          return (
            <button
              key={table.id}
              type="button"
              onClick={() => onNavigate(table.id)}
              style={{ paddingLeft: `${12 + depth * 16}px` }}
              className={[
                "flex items-center justify-between rounded-md py-1.5 pr-3 text-left text-sm transition-colors",
                isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-200/70",
              ].join(" ")}
            >
              <span className="truncate">{table.label}</span>
              {hasError && <span className="ml-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}