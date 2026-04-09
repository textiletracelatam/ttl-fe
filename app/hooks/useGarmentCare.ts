"use client";

import { useEffect, useState } from "react";
import { useProductId } from "./useProductId";
import type { ProductImage } from "../context/ProductContext";
import { appConfig } from "../config";

export type GarmentCareSection = {
  title: string;
  text: string;
};

export type GarmentCare = {
  images: ProductImage[];
  sections: GarmentCareSection[];
  linkUrl: string;
  linkLabel: string;
};

export function useGarmentCare() {
  const id = useProductId();
  const [data, setData] = useState<GarmentCare | null>(null);

  useEffect(() => {
    fetch(`${appConfig.ttlApiHost}/api/v1/products/${id}/care-instruction`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [id]);

  return data;
}
