"use client";

import { redirect, useSearchParams, usePathname } from "next/navigation";

export function useProductId() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  if (!productId && !pathname.includes("admin")) redirect("https://textiletracelatam.com/404");
  return productId ?? "";
}
