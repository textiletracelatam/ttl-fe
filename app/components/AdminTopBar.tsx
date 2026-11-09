"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminTopBar() {
  const translation = useTranslations("admin.topBar");
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Direct nav targets. The third admin page (passport-edit) isn't listed
   * here — it only makes sense addressed with a specific ?id=, which is
   * why it's reached via the Passports list rather than a standalone link.
   */
  const navLinks = [
    { href: "/admin/passports", label: translation("navPassports") },
    {
      href: "/admin/product-passport-form",
      label: translation("navNewPassport"),
    },
  ];

  function handleLogout() {
    logout();
    router.push("/admin/login");
  }

  return (
    <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-2 dark:border-neutral-700 dark:bg-neutral-800">
      <nav className="flex items-center gap-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-medium transition-colors ${
                isActive
                  ? "text-primary-700 dark:text-primary-300"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="cursor-pointer text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
      >
        {translation("logout")}
      </button>
    </div>
  );
}
