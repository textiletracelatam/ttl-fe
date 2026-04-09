"use client";

import { useEffect, useState } from "react";
import { useProductId } from "./useProductId";
import { appConfig } from "../config";

export type CompositionMaterial = {
  name: string;
  percentage: number;
  description: string;
  color: string;
  main: boolean;
};

export type Composition = {
  materials: CompositionMaterial[];
};

export function useComposition() {
  const id = useProductId();
  const [data, setData] = useState<Composition | null>(null);

  useEffect(() => {
    fetch(`${appConfig.ttlApiHost}/api/v1/products/${id}/materials`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [id]);

  return data;
}
