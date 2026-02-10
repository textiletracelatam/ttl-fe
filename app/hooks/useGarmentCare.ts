"use client";

import { useEffect, useState } from "react";
import { useProductId } from "./useProductId";
import type { ProductImage } from "../context/ProductContext";

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
    fetch(`/api/product/${id}/garment-care`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [id]);

  return data;
}
