"use client";

import { useEffect, useState } from "react";
import { useProductId } from "./useProductId";
import type { ProductImage } from "../context/ProductContext";

export type SupplyChainStage = {
  id: number;
  name: string;
  description: string;
  images: ProductImage[];
  position: [number, number];
};

export type SupplyChain = {
  stages: SupplyChainStage[];
  completion: number;
};

export function useSupplyChain() {
  const id = useProductId();
  const [supplyChain, setSupplyChain] = useState<SupplyChain | null>(null);

  useEffect(() => {
    fetch(`/api/product/${id}/supply-chain`)
      .then((res) => res.json())
      .then((data) => setSupplyChain(data));
  }, [id]);

  return supplyChain;
}
