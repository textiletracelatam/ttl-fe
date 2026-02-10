"use client";

import { useSearchParams } from "next/navigation";

export function useProductId() {
  const searchParams = useSearchParams();
  return searchParams.get("id") ?? "";
}