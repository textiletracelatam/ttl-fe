"use client";

import { TABLE_SCHEMA_BY_ID, type TableDef } from "@/app/lib/dpp-form-schema";

interface TableCardProps {
  table: TableDef;
  values: Record<string, string | boolean>;
  missingFieldLabels?: string[];
  onFieldChange: (fieldName: string, value: string | boolean) => void;
}

export default function FormCard({ table, values, missingFieldLabels, onFieldChange }: TableCardProps) {
  const parentLabel = table.parent ? TABLE_SCHEMA_BY_ID[table.parent]?.label : undefined;

  return (
    <section
      id={`section-${table.id}`}
      className="scroll-mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">
            {table.label}
            {parentLabel && (
              <span className="ml-2 text-xs font-normal text-slate-400">under {parentLabel}</span>
            )}
          </h3>
          {table.description && <p className="mt-0.5 text-xs text-slate-500">{table.description}</p>}
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
          table: {table.id}
        </span>
      </div>

      {missingFieldLabels && missingFieldLabels.length > 0 && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          Missing required: {missingFieldLabels.join(", ")}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {table.fields.map((field) => {
          const inputId = `${table.id}-${field.name}`;
          return (
            <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
              <label htmlFor={inputId} className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-700">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === "textarea" && (
                <textarea
                  id={inputId}
                  rows={3}
                  placeholder={field.placeholder}
                  value={(values[field.name] as string) ?? ""}
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
              )}

              {field.type === "select" && (
                <select
                  id={inputId}
                  value={(values[field.name] as string) ?? ""}
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                >
                  <option value="">Select…</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "checkbox" && (
                <div className="flex h-9 items-center">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={(values[field.name] as boolean) ?? false}
                    onChange={(e) => onFieldChange(field.name, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </div>
              )}

              {!["textarea", "select", "checkbox"].includes(field.type) && (
                <input
                  id={inputId}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={(values[field.name] as string) ?? ""}
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}