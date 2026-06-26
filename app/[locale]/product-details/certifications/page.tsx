import { setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n";
import CertificationsContent from "@/app/[locale]/product-details/certifications/CertificationsContent";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function CertificationsPage({
  params,
}: {
  params: { locale: string };
}) {
  setRequestLocale(params.locale);

  return <CertificationsContent />;
}
