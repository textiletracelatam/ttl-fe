"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginContent() {
  const translation = useTranslations("admin.login");
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(email, password);
      router.push("/admin/passports");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : translation("signInFailed"),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-neutral-50 px-6 py-12 dark:bg-neutral-900">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-700 dark:bg-neutral-800"
      >
        <h1 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-white">
          {translation("title")}
        </h1>

        <label
          htmlFor="email"
          className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
        >
          {translation("emailLabel")}
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400"
        />

        <label
          htmlFor="password"
          className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
        >
          {translation("passwordLabel")}
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-900 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400"
        />

        {error && (
          <p className="mb-4 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-primary-600 dark:shadow-none dark:hover:bg-primary-500"
        >
          {submitting ? translation("signingIn") : translation("signIn")}
        </button>
      </form>
    </div>
  );
}
