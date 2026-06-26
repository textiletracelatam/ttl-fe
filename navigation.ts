import { createNavigation } from "next-intl/navigation";
import { locales, defaultLocale } from "@/i18n";

export const { Link, redirect, useRouter, usePathname } = createNavigation({
  locales,
  defaultLocale,
  localePrefix: "always", // ensures /en/... URLs are always used
});