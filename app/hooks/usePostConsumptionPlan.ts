"use client";

import { useEffect, useState } from "react";
import { useProductId } from "./useProductId";
import { appConfig } from "../config";

export type PostConsumptionPlan = {
  image: string;
  description: string;
};

export function usePostConsumptionPlan() {
  const id = useProductId();
  const [data, setData] = useState<PostConsumptionPlan | null>(null);

  useEffect(() => {
    fetch(`${appConfig.ttlApiHost}/api/v1/products/${id}/post-consumption-plan`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [id]);

  return data;
}
