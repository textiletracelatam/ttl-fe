"use client";

import { useSearchParams } from "next/navigation";

export function usePassportId() {
  const searchParams = useSearchParams();
  return searchParams.get("id") ?? "";
}
