"use client";

import { useEffect, useState } from "react";
import { useProductId } from "./useProductId";

export type Certification = {
  name: string;
  issuer: string;
  scope: string;
  description: string;
  validUntil: string;
  status: "active" | "expired";
};

export function useCertifications() {
  const id = useProductId();
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    fetch(`/api/product/${id}/certifications`)
      .then((res) => res.json())
      .then((data) => setCertifications(data));
  }, [id]);

  return certifications;
}
