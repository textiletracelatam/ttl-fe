"use client";

import { useState } from "react";
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
  initialFormState,
  autofillFormState, // add this
  type FieldValue,
  type FormState,
  type RecordValues,
  type TableDef,
} from "@/app/lib/dppFormSchema";
import { appConfig } from "@/app/config";
import { useAuthFetch } from "@/app/hooks/useAuthFetch";

const LAMBDA_ENDPOINT = `${appConfig.ttlApiHost}/api/v1/passports`;

// Separate endpoint for step 1 (file uploads). Point this at whatever
// accepts the multipart upload and returns a URL per file — an S3
// pre-signed-upload Lambda, a direct S3 POST policy endpoint, etc.
const FILES_ENDPOINT = `${appConfig.ttlApiHost}/api/v1/passports/upload`;

function isFieldFilled(value: FieldValue): boolean {
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "boolean") return true; // a checkbox always has a definite value
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

/**
 * Error keys are either:
 *  - the table id, for non-collection tables (e.g. "products")
 *  - `${tableId}#${entryIndex}`, for a specific entry in a collection
 *    table (e.g. "materials#0", "materials#1")
 */
type ErrorsState = Record<string, string[]>;

function errorKey(tableId: string, entryIndex?: number) {
  return entryIndex === undefined ? tableId : `${tableId}#${entryIndex}`;
}

// ---------------------------------------------------------------------
// File upload helpers
// ---------------------------------------------------------------------

/**
 * Identifies exactly where one uploaded file belongs in the schema, so we
 * can match the URL the upload endpoint returns back to the right
 * table/entry/field when we build the JSON payload in step 2.
 * Non-collection tables always use entryIndex 0.
 */
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

/** Walks every table/entry/field and flattens out every attached File. */
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

/**
 * Step 1: uploads every attached file in a single multipart request.
 * Sends a JSON "manifest" alongside the files so the backend knows which
 * form field each file came from, and expects back a URL per file keyed
 * the same way. Skips the request entirely when there's nothing to upload.
 */
async function uploadFiles(
  entries: FileEntry[],
  authFetch: (url: string, init?: RequestInit) => Promise<Response>,
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

  const response = await authFetch(FILES_ENDPOINT, {
    method: "POST",
    body,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      text || translation("uploadFailedStatus", { status: response.status }),
    );
  }

  // Expected response shape: { files: { [key]: url } }
  const result = await response.json();
  return (result?.files as Record<string, string>) ?? {};
}

/**
 * Step 2 prep: turns the in-memory FormState (which holds raw File objects)
 * into a plain JSON-serializable payload, swapping each file field's
 * File[] for the array of URLs returned by uploadFiles().
 */
function buildJsonPayload(
  data: FormState,
  uploadedUrls: Record<string, string>,
): Record<string, unknown> {
  function buildRow(
    table: TableDef,
    row: RecordValues,
    entryIndex: number,
  ): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const field of table.fields) {
      if (field.type === "file") {
        const files = (row[field.name] as File[] | undefined) ?? [];
        out[field.name] = files.map(
          (_, fileIndex) =>
            uploadedUrls[fileKey(table.id, entryIndex, field.name, fileIndex)],
        );
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

function ProductPassportFormInner() {
  const translation = useTranslations("admin.passportForm");
  const authFetch = useAuthFetch();
  const [formData, setFormData] = useState<FormState>(() => initialFormState());
  const [activeSection, setActiveSection] = useState<string>(
    TABLE_SCHEMA[0].id,
  );
  const [errors, setErrors] = useState<ErrorsState>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  function updateField(
    tableId: string,
    fieldName: string,
    value: FieldValue,
    entryIndex?: number,
  ) {
    setFormData((prev) => {
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
      const rows = [...(prev[tableId] as RecordValues[])];
      rows.push(createEmptyRecordFor(tableId));
      return { ...prev, [tableId]: rows };
    });
  }

  function removeEntry(tableId: string, entryIndex: number) {
    setFormData((prev) => {
      const rows = [...(prev[tableId] as RecordValues[])];
      rows.splice(entryIndex, 1);
      return { ...prev, [tableId]: rows };
    });
    // Drop any error state tied to this entry; re-validation will
    // re-populate it if the remaining rows still have issues.
    setErrors((prev) => {
      const next = { ...prev };
      delete next[errorKey(tableId, entryIndex)];
      return next;
    });
  }

  function validate(): ErrorsState {
    const nextErrors: ErrorsState = {};

    for (const table of TABLE_SCHEMA) {
      // brands/manufacturers are mutually exclusive — validated separately below.
      if (table.id === "brands" || table.id === "manufacturers") continue;

      const data = formData[table.id];
      const rows: RecordValues[] = table.isCollection
        ? (data as RecordValues[])
        : [data as RecordValues];

      rows.forEach((row, idx) => {
        const missing: string[] = [];
        for (const field of table.fields) {
          if (field.required) {
            const value = row?.[field.name];
            if (typeof value === "string" && value.trim() === "") {
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

    // --- Brand / Manufacturer mutual exclusivity --------------------------
    const brandsTable = TABLE_SCHEMA_BY_ID.brands;
    const manufacturersTable = TABLE_SCHEMA_BY_ID.manufacturers;
    const brandsRow = formData.brands as RecordValues;
    const manufacturersRow = formData.manufacturers as RecordValues;

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

    const validationErrors = validate();
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
      // Step 1: upload every attached file in one multipart request. The
      // backend stores them (e.g. to S3) and returns a URL per file, keyed
      // by the same manifest key we sent it with.
      setStatusMessage(translation("uploadingFiles"));
      const fileEntries = collectFileEntries(formData);
      const uploadedUrls = await uploadFiles(fileEntries, authFetch, translation);

      // Step 2: send the rest of the data as a single JSON payload, with
      // file fields replaced by the URLs from step 1 instead of raw File
      // objects (which can't be JSON-serialized anyway). The Lambda is
      // responsible for the insert order across tables (respecting the
      // brand/manufacturer/material -> product -> supply_chain ->
      // supply_chain_stages hierarchy) and for inserting one row per
      // array entry for collection tables (isCollection: true).
      setStatusMessage(translation("savingSubmission"));
      const payload = buildJsonPayload(formData, uploadedUrls);

      const response = await authFetch(LAMBDA_ENDPOINT, {
        method: "POST",
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
      setStatusMessage(translation("submitted"));
      setFormData(initialFormState());
      setErrors({});
    } catch (err) {
      setStatus("error");
      setStatusMessage(
        err instanceof Error ? err.message : translation("submittingFailedGeneric"),
      );
    }
  }

  function handleAutofill() {
    setFormData(autofillFormState());
    setErrors({});
    setStatus("idle");
    setStatusMessage("");
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
          <header className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {translation("createTitle")}
              </h1>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                {translation("createDescription")}
              </p>
            </div>

            {process.env.NODE_ENV !== "production" && (
              <button
                type="button"
                onClick={handleAutofill}
                className="shrink-0 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-700 transition-colors hover:bg-yellow-100 dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50"
                title={translation("autofillTitle")}
              >
                {translation("autofillButton")}
              </button>
            )}
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
                      className="self-start rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                    >
                      {translation("addEntry", { label: table.label })}
                    </button>
                  </div>
                );
              })}
            </div>

            <StickySubmitBar status={status} statusMessage={statusMessage} />
          </form>
        </main>
      </div>
    </div>
  );
}

export default function ProductPassportFormContent() {
  return (
    <AdminGuard>
      <ProductPassportFormInner />
    </AdminGuard>
  );
}
