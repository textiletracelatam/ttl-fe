"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import AdminGuard from "@/app/components/AdminGuard";
import SideNav from "@/app/components/SideNav";
import TableCard from "@/app/components/TableCard";
import StickySubmitBar, {
  type SubmitStatus,
} from "@/app/components/StickySubmitFormBar";
import {
  TABLE_SCHEMA,
  TABLE_SCHEMA_BY_ID,
  createEmptyRecordFor,
  type FieldValue,
  type FormState,
  type RecordValues,
} from "@/app/lib/dppFormSchema";
import { appConfig } from "@/app/config";
import { useAuthFetch } from "@/app/hooks/useAuthFetch";
import { usePassportId } from "@/app/hooks/usePassportId";

const PASSPORTS_ENDPOINT = `${appConfig.ttlApiHost}/api/v1/passports`;
const FILES_ENDPOINT = `${appConfig.ttlApiHost}/api/v1/passports/upload`;

function isFieldFilled(value: FieldValue): boolean {
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "boolean") return true;
  return Array.isArray(value) && value.length > 0;
}

type ExclusivityState = "empty" | "complete" | "partial";

function exclusivityState(
  row: RecordValues,
  fields: { name: string; required?: boolean }[],
): ExclusivityState {
  const required = fields.filter((f) => f.required);
  const filledCount = required.filter((f) => isFieldFilled(row[f.name])).length;
  if (filledCount === 0) return "empty";
  if (filledCount === required.length) return "complete";
  return "partial";
}

type ErrorsState = Record<string, string[]>;

function errorKey(tableId: string, entryIndex?: number) {
  return entryIndex === undefined ? tableId : `${tableId}#${entryIndex}`;
}

// ---------------------------------------------------------------------
// Existing-file tracking — the API returns already-uploaded file fields
// as arrays of URL strings, not File objects, so they can't live directly
// in FormState (whose file fields are typed File[]). Pulled out into a
// side map instead, keyed the same way collectFileEntries below keys
// newly-picked files (minus the trailing file-index segment), and shown
// by TableCard / re-attached in buildJsonPayload when the user doesn't
// pick a replacement.
// ---------------------------------------------------------------------

function existingFileFieldKey(
  tableId: string,
  entryIndex: number,
  fieldName: string,
) {
  return `${tableId}#${entryIndex}#${fieldName}`;
}

function splitOutExistingFiles(tables: FormState): {
  formState: FormState;
  existingFileURLs: Record<string, string[]>;
} {
  const existingFileURLs: Record<string, string[]> = {};
  const formState: FormState = {};

  for (const table of TABLE_SCHEMA) {
    const raw = tables[table.id];
    const rawRows: Record<string, unknown>[] = table.isCollection
      ? ((raw as Record<string, unknown>[]) ?? [])
      : [(raw as Record<string, unknown>) ?? {}];

    const rows: RecordValues[] = rawRows.map((row, entryIndex) => {
      const out: RecordValues = {};

      for (const field of table.fields) {
        if (field.type === "file") {
          const urls = (row[field.name] as string[] | undefined) ?? [];

          if (urls.length > 0) {
            existingFileURLs[existingFileFieldKey(table.id, entryIndex, field.name)] =
              urls;
          }

          out[field.name] = [];
        } else {
          out[field.name] = (row[field.name] as FieldValue) ?? "";
        }
      }

      return out;
    });

    formState[table.id] = table.isCollection
      ? rows.length > 0
        ? rows
        : [createEmptyRecordFor(table.id)]
      : (rows[0] ?? createEmptyRecordFor(table.id));
  }

  return { formState, existingFileURLs };
}

// ---------------------------------------------------------------------
// File upload helpers — identical to ProductPassportFormContent.tsx's.
// ---------------------------------------------------------------------

function fileKey(
  tableId: string,
  entryIndex: number,
  fieldName: string,
  fileIndex: number,
) {
  return `${tableId}#${entryIndex}#${fieldName}#${fileIndex}`;
}

interface FileEntry {
  key: string;
  file: File;
}

function collectFileEntries(data: FormState): FileEntry[] {
  const entries: FileEntry[] = [];
  for (const table of TABLE_SCHEMA) {
    const value = data[table.id];
    const rows: RecordValues[] = table.isCollection
      ? (value as RecordValues[])
      : [value as RecordValues];

    rows.forEach((row, entryIndex) => {
      for (const field of table.fields) {
        if (field.type !== "file") continue;
        const files = (row[field.name] as File[] | undefined) ?? [];
        files.forEach((file, fileIndex) => {
          entries.push({
            key: fileKey(table.id, entryIndex, field.name, fileIndex),
            file,
          });
        });
      }
    });
  }
  return entries;
}

async function uploadFiles(
  entries: FileEntry[],
  translation: (
    key: string,
    values?: Record<string, string | number | Date>,
  ) => string,
): Promise<Record<string, string>> {
  if (entries.length === 0) return {};

  const body = new FormData();
  const manifest = entries.map(({ key, file }) => ({
    key,
    filename: file.name,
  }));
  body.append("manifest", JSON.stringify(manifest));
  entries.forEach(({ key, file }) => {
    body.append(key, file, file.name);
  });

  const response = await fetch(FILES_ENDPOINT, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      text || translation("uploadFailedStatus", { status: response.status }),
    );
  }

  const result = await response.json();
  return (result?.files as Record<string, string>) ?? {};
}

/**
 * Same as ProductPassportFormContent.tsx's buildJsonPayload, except a file
 * field with no newly-picked files falls back to its existingFileURLs
 * entry instead of emitting an empty array — otherwise saving an edit that
 * doesn't touch an image field would silently wipe it.
 */
function buildJsonPayload(
  data: FormState,
  uploadedUrls: Record<string, string>,
  existingFileURLs: Record<string, string[]>,
): Record<string, unknown> {
  function buildRow(
    table: (typeof TABLE_SCHEMA)[number],
    row: RecordValues,
    entryIndex: number,
  ): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const field of table.fields) {
      if (field.type === "file") {
        const files = (row[field.name] as File[] | undefined) ?? [];

        if (files.length > 0) {
          out[field.name] = files.map(
            (_, fileIndex) =>
              uploadedUrls[fileKey(table.id, entryIndex, field.name, fileIndex)],
          );
        } else {
          out[field.name] =
            existingFileURLs[existingFileFieldKey(table.id, entryIndex, field.name)] ??
            [];
        }
      } else {
        out[field.name] = row[field.name];
      }
    }
    return out;
  }

  const payload: Record<string, unknown> = {};
  for (const table of TABLE_SCHEMA) {
    const value = data[table.id];
    payload[table.id] = table.isCollection
      ? (value as RecordValues[]).map((row, idx) => buildRow(table, row, idx))
      : buildRow(table, value as RecordValues, 0);
  }
  return payload;
}

type LoadState = "loading" | "ready" | "error";

function PassportEditInner() {
  const translation = useTranslations("admin.passportForm");
  const id = usePassportId();
  const authFetch = useAuthFetch();

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState("");
  const [formData, setFormData] = useState<FormState | null>(null);
  const [existingFileURLs, setExistingFileURLs] = useState<
    Record<string, string[]>
  >({});
  const [activeSection, setActiveSection] = useState<string>(TABLE_SCHEMA[0].id);
  const [errors, setErrors] = useState<ErrorsState>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  useEffect(() => {
    if (!id) {
      setLoadState("error");
      setLoadError(translation("missingPassportId"));
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const response = await authFetch(`${PASSPORTS_ENDPOINT}/${id}`);

        if (!response.ok) {
          throw new Error(
            translation("loadPassportFailedStatus", { status: response.status }),
          );
        }

        const data = (await response.json()) as { tables: FormState };
        const { formState, existingFileURLs: files } = splitOutExistingFiles(
          data.tables,
        );

        if (!cancelled) {
          setFormData(formState);
          setExistingFileURLs(files);
          setLoadState("ready");
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error
              ? err.message
              : translation("loadPassportFailedGeneric"),
          );
          setLoadState("error");
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id, authFetch, translation]);

  function updateField(
    tableId: string,
    fieldName: string,
    value: FieldValue,
    entryIndex?: number,
  ) {
    setFormData((prev) => {
      if (!prev) return prev;
      const table = TABLE_SCHEMA_BY_ID[tableId];
      if (table.isCollection) {
        const rows = [...(prev[tableId] as RecordValues[])];
        const idx = entryIndex ?? 0;
        rows[idx] = { ...rows[idx], [fieldName]: value };
        return { ...prev, [tableId]: rows };
      }
      return {
        ...prev,
        [tableId]: { ...(prev[tableId] as RecordValues), [fieldName]: value },
      };
    });
  }

  function addEntry(tableId: string) {
    setFormData((prev) => {
      if (!prev) return prev;
      const rows = [...(prev[tableId] as RecordValues[])];
      rows.push(createEmptyRecordFor(tableId));
      return { ...prev, [tableId]: rows };
    });
  }

  function removeEntry(tableId: string, entryIndex: number) {
    setFormData((prev) => {
      if (!prev) return prev;
      const rows = [...(prev[tableId] as RecordValues[])];
      rows.splice(entryIndex, 1);
      return { ...prev, [tableId]: rows };
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[errorKey(tableId, entryIndex)];
      return next;
    });
  }

  function validate(data: FormState): ErrorsState {
    const nextErrors: ErrorsState = {};

    for (const table of TABLE_SCHEMA) {
      if (table.id === "brands" || table.id === "manufacturers") continue;

      const value = data[table.id];
      const rows: RecordValues[] = table.isCollection
        ? (value as RecordValues[])
        : [value as RecordValues];

      rows.forEach((row, idx) => {
        const missing: string[] = [];
        for (const field of table.fields) {
          if (field.required) {
            const fieldValue = row?.[field.name];
            if (typeof fieldValue === "string" && fieldValue.trim() === "") {
              missing.push(field.label);
            }
          }
        }
        if (missing.length) {
          nextErrors[errorKey(table.id, table.isCollection ? idx : undefined)] =
            missing;
        }
      });
    }

    const brandsTable = TABLE_SCHEMA_BY_ID.brands;
    const manufacturersTable = TABLE_SCHEMA_BY_ID.manufacturers;
    const brandsRow = data.brands as RecordValues;
    const manufacturersRow = data.manufacturers as RecordValues;

    const brandsState = exclusivityState(brandsRow, brandsTable.fields);
    const manufacturersState = exclusivityState(
      manufacturersRow,
      manufacturersTable.fields,
    );

    if (brandsState === "partial") {
      nextErrors.brands = brandsTable.fields
        .filter((f) => f.required && !isFieldFilled(brandsRow[f.name]))
        .map((f) => f.label);
    }
    if (manufacturersState === "partial") {
      nextErrors.manufacturers = manufacturersTable.fields
        .filter((f) => f.required && !isFieldFilled(manufacturersRow[f.name]))
        .map((f) => f.label);
    }

    if (brandsState !== "partial" && manufacturersState !== "partial") {
      if (brandsState === "complete" && manufacturersState === "complete") {
        const message = translation("brandOrManufacturerBoth");
        nextErrors.brands = [message];
        nextErrors.manufacturers = [message];
      } else if (brandsState === "empty" && manufacturersState === "empty") {
        const message = translation("brandOrManufacturerNeither");
        nextErrors.brands = [message];
        nextErrors.manufacturers = [message];
      }
    }

    return nextErrors;
  }

  function sectionsWithErrors(errs: ErrorsState): Set<string> {
    return new Set(Object.keys(errs).map((key) => key.split("#")[0]));
  }

  function scrollToSection(id: string) {
    setActiveSection(id);
    document
      .getElementById(`section-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData) return;

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    const firstInvalid = TABLE_SCHEMA.find((t) =>
      Object.keys(validationErrors).some(
        (key) => key === t.id || key.startsWith(`${t.id}#`),
      ),
    );

    if (firstInvalid) {
      scrollToSection(firstInvalid.id);
      setStatus("error");
      setStatusMessage(translation("fillRequired"));
      return;
    }

    setStatus("submitting");

    try {
      setStatusMessage(translation("uploadingFiles"));
      const fileEntries = collectFileEntries(formData);
      const uploadedUrls = await uploadFiles(fileEntries, translation);

      setStatusMessage(translation("savingChanges"));
      const payload = buildJsonPayload(formData, uploadedUrls, existingFileURLs);

      const response = await authFetch(`${PASSPORTS_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tables: payload }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          text || translation("requestFailedStatus", { status: response.status }),
        );
      }

      setStatus("success");
      setStatusMessage(translation("saved"));
      setErrors({});
    } catch (err) {
      setStatus("error");
      setStatusMessage(
        err instanceof Error ? err.message : translation("savingFailedGeneric"),
      );
    }
  }

  if (loadState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-sm text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
        {translation("loadingPassport")}
      </div>
    );
  }

  if (loadState === "error" || !formData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 text-center dark:bg-neutral-900">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-white">
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10">
        <SideNav
          activeSection={activeSection}
          sectionsWithErrors={sectionsWithErrors(errors)}
          onNavigate={scrollToSection}
          entryCounts={Object.fromEntries(
            TABLE_SCHEMA.filter((t) => t.isCollection).map((t) => [
              t.id,
              (formData[t.id] as RecordValues[]).length,
            ]),
          )}
        />

        <main className="min-w-0 flex-1">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">
              {translation("editTitle")}
            </h1>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {translation("editDescription")}
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-6">
              {TABLE_SCHEMA.map((table) => {
                if (!table.isCollection) {
                  return (
                    <TableCard
                      key={table.id}
                      table={table}
                      values={formData[table.id] as RecordValues}
                      missingFieldLabels={errors[table.id]}
                      existingFileURLs={Object.fromEntries(
                        table.fields
                          .filter((f) => f.type === "file")
                          .map((f) => [
                            f.name,
                            existingFileURLs[
                              existingFileFieldKey(table.id, 0, f.name)
                            ] ?? [],
                          ]),
                      )}
                      onFieldChange={(fieldName, value) =>
                        updateField(table.id, fieldName, value)
                      }
                    />
                  );
                }

                const rows = formData[table.id] as RecordValues[];
                return (
                  <div
                    key={table.id}
                    id={`section-${table.id}`}
                    className="scroll-mt-10 flex flex-col gap-3"
                  >
                    {rows.length === 0 && (
                      <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-6 text-center text-sm text-neutral-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                        {translation("noEntriesYet", {
                          label: table.label.toLowerCase(),
                        })}
                      </div>
                    )}

                    {rows.map((row, idx) => (
                      <TableCard
                        key={`${table.id}-${idx}`}
                        table={table}
                        values={row}
                        entryIndex={idx + 1}
                        missingFieldLabels={errors[errorKey(table.id, idx)]}
                        existingFileURLs={Object.fromEntries(
                          table.fields
                            .filter((f) => f.type === "file")
                            .map((f) => [
                              f.name,
                              existingFileURLs[
                                existingFileFieldKey(table.id, idx, f.name)
                              ] ?? [],
                            ]),
                        )}
                        onFieldChange={(fieldName, value) =>
                          updateField(table.id, fieldName, value, idx)
                        }
                        onRemove={
                          rows.length > 1 || idx > 0
                            ? () => removeEntry(table.id, idx)
                            : undefined
                        }
                      />
                    ))}

                    <button
                      type="button"
                      onClick={() => addEntry(table.id)}
                      className="cursor-pointer self-start rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                    >
                      {translation("addEntry", { label: table.label })}
                    </button>
                  </div>
                );
              })}
            </div>

            <StickySubmitBar
              status={status}
              statusMessage={statusMessage}
              submitLabel={translation("saveChanges")}
            />
          </form>
        </main>
      </div>
    </div>
  );
}

export default function PassportEditContent() {
  return (
    <AdminGuard>
      <PassportEditInner />
    </AdminGuard>
  );
}
