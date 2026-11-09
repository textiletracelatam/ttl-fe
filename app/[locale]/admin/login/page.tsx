import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import LoginContent from "@/app/[locale]/admin/login/LoginContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function AdminLoginPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <LoginContent />;
}
