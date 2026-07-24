"use client";

import { useState } from "react";
import SideNav from "@/app/components/SideNav";
import TableCard from "@/app/components/FormCard";
import StickySubmitBar, { type SubmitStatus } from "@/app/components/StickySubmitFormBar";
import { TABLE_SCHEMA, type FormState, initialFormState } from "@/app/lib/dpp-form-schema";

const LAMBDA_ENDPOINT =
  process.env.NEXT_PUBLIC_LAMBDA_ENDPOINT ?? "https://YOUR-LAMBDA-ENDPOINT.execute-api.region.amazonaws.com/submit";

export default function ProductPassportFormContent() {
  const [formData, setFormData] = useState<FormState>(() => initialFormState());
  const [activeSection, setActiveSection] = useState<string>(TABLE_SCHEMA[0].id);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");

  function updateField(tableId: string, fieldName: string, value: string | boolean) {
    setFormData((prev) => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        [fieldName]: value,
      },
    }));
  }

  function validate(): Record<string, string[]> {
    const nextErrors: Record<string, string[]> = {};
    for (const table of TABLE_SCHEMA) {
      const missing: string[] = [];
      for (const field of table.fields) {
        if (field.required) {
          const value = formData[table.id]?.[field.name];
          if (typeof value === "string" && value.trim() === "") {
            missing.push(field.label);
          }
        }
      }
      if (missing.length > 0) {
        nextErrors[table.id] = missing;
      }
    }
    return nextErrors;
  }

  function scrollToSection(id: string) {
    setActiveSection(id);
    document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    const firstInvalid = TABLE_SCHEMA.find((t) => validationErrors[t.id]);
    if (firstInvalid) {
      scrollToSection(firstInvalid.id);
      setStatus("error");
      setStatusMessage("Fill in the required fields highlighted below before submitting.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      // Single request: the Lambda receives the whole payload, grouped by
      // table name, and is responsible for the insert order across the
      // 15 tables (respecting the brand/manufacturer/material -> product ->
      // product_supply -> product_supply_stage hierarchy).
      const response = await fetch(LAMBDA_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tables: formData }),
      });

      // --- Alternative: one request per table, in hierarchy order -------
      // for (const table of TABLE_SCHEMA) {
      //   await fetch(`${LAMBDA_ENDPOINT}/${table.id}`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(formData[table.id]),
      //   });
      // }
      // --------------------------------------------------------------------

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || `Request failed with status ${response.status}`);
      }

      setStatus("success");
      setStatusMessage("Submitted. All records were sent for insertion.");
      setFormData(initialFormState());
      setErrors({});
    } catch (err) {
      setStatus("error");
      setStatusMessage(
        err instanceof Error ? err.message : "Something went wrong while submitting. Please try again."
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10">
        <SideNav
          activeSection={activeSection}
          sectionsWithErrors={new Set(Object.keys(errors))}
          onNavigate={scrollToSection}
        />

        <main className="min-w-0 flex-1">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Product Passport Intake</h1>
            <p className="mt-1 text-sm text-slate-600">
              Fill in each section below, then submit once. Data is grouped by table and sent
              to the ingestion Lambda in one request.
            </p>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-6">
              {TABLE_SCHEMA.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  values={formData[table.id]}
                  missingFieldLabels={errors[table.id]}
                  onFieldChange={(fieldName, value) => updateField(table.id, fieldName, value)}
                />
              ))}
            </div>

            <StickySubmitBar status={status} statusMessage={statusMessage} />
          </form>
        </main>
      </div>
    </div>
  );
}