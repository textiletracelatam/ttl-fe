"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import AdminGuard from "@/app/components/AdminGuard";
import AppDialog from "@/app/components/AppDialog";
import { useAuthFetch } from "@/app/hooks/useAuthFetch";
import { appConfig } from "@/app/config";

type PassportSummary = {
  id: number;
  productId: number;
  productName: string;
  brandName?: string;
  manufacturerName?: string;
  version: string;
  validationStatus: string;
  updatedAt: string;
};

const PASSPORTS_ENDPOINT = `${appConfig.ttlApiHost}/api/v1/passports`;

function PassportsListInner() {
  const translation = useTranslations("admin.passportsList");
  const authFetch = useAuthFetch();
  const [passports, setPassports] = useState<PassportSummary[] | null>(null);
  const [error, setError] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await authFetch(PASSPORTS_ENDPOINT);

        if (!response.ok) {
          throw new Error(
            translation("loadFailedStatus", { status: response.status }),
          );
        }

        const data = (await response.json()) as PassportSummary[];

        if (!cancelled) setPassports(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : translation("loadFailedGeneric"),
          );
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [authFetch, translation]);

  async function confirmDelete() {
    if (deleteTargetId === null) return;

    setDeleting(true);

    try {
      const response = await authFetch(
        `${PASSPORTS_ENDPOINT}/${deleteTargetId}`,
        { method: "DELETE" },
      );

      if (!response.ok && response.status !== 204) {
        throw new Error(
          translation("deleteFailedStatus", { status: response.status }),
        );
      }

      setPassports((prev) => prev?.filter((p) => p.id !== deleteTargetId) ?? null);
      setDeleteTargetId(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : translation("deleteFailedGeneric"),
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-10 text-neutral-900 dark:bg-neutral-900 dark:text-white">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            {translation("title")}
          </h1>
          <Link
            href="/admin/product-passport-form"
            className="shrink-0 rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            {translation("newPassport")}
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3">{translation("columnProduct")}</th>
                <th className="px-4 py-3">{translation("columnBrand")}</th>
                <th className="px-4 py-3">{translation("columnVersion")}</th>
                <th className="px-4 py-3">{translation("columnStatus")}</th>
                <th className="px-4 py-3">{translation("columnUpdated")}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {passports === null && (
                <tr>
                  <td className="px-4 py-6 text-center text-neutral-400 dark:text-neutral-500" colSpan={6}>
                    {translation("loading")}
                  </td>
                </tr>
              )}
              {passports?.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-neutral-400 dark:text-neutral-500" colSpan={6}>
                    {translation("empty")}
                  </td>
                </tr>
              )}
              {passports?.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium">{p.productName}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                    {p.brandName || p.manufacturerName || "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">{p.version}</td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                    {p.validationStatus}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 dark:text-neutral-300">
                    {new Date(p.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/passport-edit?id=${p.id}`}
                      className="mr-3 text-sm font-medium text-neutral-700 hover:underline dark:text-neutral-300"
                    >
                      {translation("edit")}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTargetId(p.id)}
                      className="cursor-pointer text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      {translation("delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AppDialog
        open={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        title={translation("deleteDialogTitle")}
      >
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">
          {translation("deleteDialogBody")}
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setDeleteTargetId(null)}
            className="cursor-pointer rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-700"
          >
            {translation("cancel")}
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={deleting}
            className="cursor-pointer rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-700 dark:hover:bg-red-600"
          >
            {deleting ? translation("deleting") : translation("delete")}
          </button>
        </div>
      </AppDialog>
    </div>
  );
}

export default function PassportsListContent() {
  return (
    <AdminGuard>
      <PassportsListInner />
    </AdminGuard>
  );
}
