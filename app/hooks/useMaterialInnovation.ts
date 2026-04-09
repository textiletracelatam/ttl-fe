"use client";

import { useEffect, useState } from "react";
import { useProductId } from "./useProductId";
import type { ProductImage } from "../context/ProductContext";
import { appConfig } from "../config";

export type MaterialInnovation = {
  images: ProductImage[];
  text: string;
  linkUrl: string;
  linkLabel: string;
};

export function useMaterialInnovation() {
  const id = useProductId();
  const [data, setData] = useState<MaterialInnovation | null>(null);

  useEffect(() => {
    fetch(`${appConfig.ttlApiHost}/api/v1/products/${id}/material-innovation`)
      .then((res) => res.json())
      .then((d) => setData(d));
  }, [id]);

  return data;
}
