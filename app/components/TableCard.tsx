"use client";

import { useTranslations } from "next-intl";
import { TABLE_SCHEMA_BY_ID, type TableDef } from "@/app/lib/dppFormSchema";

interface TableCardProps {
  table: TableDef;
  values: Record<string, string | boolean | File[]>;
  missingFieldLabels?: string[];
  onFieldChange: (fieldName: string, value: string | boolean | File[]) => void;
  /**
   * 1-based position of this entry within a collection table (e.g. the 2nd
   * material added). Omit for non-collection tables, which render a single
   * card with no entry numbering.
   */
  entryIndex?: number;
  /**
   * Called when the user wants to remove this entry. Only shown when
   * provided, so callers can hide it (e.g. when only one entry is left).
   */
  onRemove?: () => void;
  /**
   * Edit mode only: already-uploaded file URLs for this row's file fields
   * (keyed by field name), fetched from the API rather than picked by the
   * user. Shown as links above the file input; leaving the input empty
   * keeps these on submit instead of clearing the field — see the caller's
   * buildJsonPayload.
   */
  existingFileURLs?: Record<string, string[]>;
}

export default function TableCard({
  table,
  values,
  missingFieldLabels,
  onFieldChange,
  entryIndex,
  onRemove,
  existingFileURLs,
}: TableCardProps) {
  const translation = useTranslations("admin.tableCard");
  const parentLabel = table.parent
    ? TABLE_SCHEMA_BY_ID[table.parent]?.label
    : undefined;

  return (
    <section
      id={entryIndex ? undefined : `section-${table.id}`}
      className="scroll-mt-10 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
    >
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold dark:text-white">
            {table.label}
            {entryIndex && (
              <span className="ml-2 text-xs font-normal text-neutral-400 dark:text-neutral-500">
                #{entryIndex}
              </span>
            )}
            {parentLabel && (
              <span className="ml-2 text-xs font-normal text-neutral-400 dark:text-neutral-500">
                {translation("underParent", { parent: parentLabel })}
              </span>
            )}
          </h3>
          {table.description && (
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{table.description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:bg-neutral-700 dark:text-neutral-300">
            {translation("tableBadge", { id: table.id })}
          </span>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-md border border-red-200 px-2 py-0.5 text-[11px] font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              {translation("remove")}
            </button>
          )}
        </div>
      </div>

      {missingFieldLabels && missingFieldLabels.length > 0 && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
          {translation("missingRequired", { list: missingFieldLabels.join(", ") })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {table.fields.map((field) => {
          const inputId = `${table.id}-${entryIndex ?? 0}-${field.name}`;
          return (
            <div
              key={field.name}
              className={field.type === "textarea" ? "sm:col-span-2" : ""}
            >
              <label
                htmlFor={inputId}
                className="mb-1 flex items-center gap-1 text-xs font-medium text-neutral-700 dark:text-neutral-300"
              >
                {field.label}
                {field.required && <span className="text-red-500 dark:text-red-400">*</span>}
              </label>

              {field.type === "textarea" && (
                <textarea
                  id={inputId}
                  rows={3}
                  placeholder={field.placeholder}
                  value={(values[field.name] as string) ?? ""}
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400"
                />
              )}

              {field.type === "select" && (
                <select
                  id={inputId}
                  value={(values[field.name] as string) ?? ""}
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
                  className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400"
                >
                  <option value="">{translation("selectPlaceholder")}</option>
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
                    type={field.type}
                    checked={(values[field.name] as boolean) ?? false}
                    onChange={(e) =>
                      onFieldChange(field.name, e.target.checked)
                    }
                    className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-600 dark:bg-neutral-900"
                  />
                </div>
              )}

              {field.type === "color" && (
                <div className="flex h-9 items-center gap-4">
                  {/* Native HTML Color Input */}
                  <input
                    type={field.type}
                    value={(values[field.name] as string) ?? ""}
                    onChange={(e) => onFieldChange(field.name, e.target.value)}
                  />
                  {/* Hex Text Input */}
                  <input
                    type="text"
                    value={(values[field.name] as string) ?? ""}
                    onChange={(e) => onFieldChange(field.name, e.target.value)}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400"
                  />
                </div>
              )}

              {field.type === "file" && (
                <div className="flex flex-col gap-1.5">
                  {existingFileURLs?.[field.name]?.length ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {existingFileURLs[field.name].map((url) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-600 hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                          {url.split("/").pop()}
                        </a>
                      ))}
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        {translation("existingFilesNote")}
                      </span>
                    </div>
                  ) : null}
                  <div className="flex h-9 items-center">
                    <input
                      id={inputId}
                      type={field.type}
                      multiple
                      onChange={(e) =>
                        onFieldChange(
                          field.name,
                          Array.from(e.target.files || []),
                        )
                      }
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400"
                    />
                  </div>
                </div>
              )}

              {!["textarea", "select", "checkbox", "color", "file"].includes(
                field.type,
              ) && (
                <input
                  id={inputId}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={(values[field.name] as string) ?? ""}
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400"
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
