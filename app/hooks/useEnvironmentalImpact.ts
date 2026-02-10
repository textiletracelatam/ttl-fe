"use client";

import { useEffect, useState } from "react";
import { useProductId } from "./useProductId";

export type ImpactLevel = "min" | "low" | "mid" | "high" | "very high";
export type ChemicalCompliance = "certified" | "yes" | "no";
export type Recyclability = "yes" | "no" | "partially recyclable";

export type EnvironmentalImpactIndicator = {
  name: string;
  value: ImpactLevel | ChemicalCompliance | Recyclability;
};

export type EnvironmentalImpact = {
  indicators: EnvironmentalImpactIndicator[];
  postConsumptionPlanUrl: string;
  certificationsUrl: string;
  learnMoreUrl: string;
};

export function useEnvironmentalImpact() {
  const id = useProductId();
  const [data, setData] = useState<EnvironmentalImpact | null>(null);

  useEffect(() => {
    fetch(`/api/product/${id}/environmental-impact`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [id]);

  return data;
}
