"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useProductId } from "../hooks/useProductId";
import { appConfig } from "../config";

export type ProductImage = {
  src: string;
  alt: string;
};

export type ProductDetail = {
  title: string;
  description: string;
  image?: string;
  /** Route segment under product-details/ */
  route: string;
  /** Completion percentage 0–100, shown as a fill effect on the card */
  completion?: number;
  /** Environmental impact 0–100, 0=green 100=red, shown as gradient bg */
  impact?: number;
  postConsumptionPlanExists?: boolean;
};

export type Product = {
  name: string;
  title: string;
  description: string;
  brand: string;
  madeIn: string;
  reference: string;
  sku: string;
  images: ProductImage[];
  details: ProductDetail[];
};

const ProductContext = createContext<Product | null>(null);

export function ProductProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const id = useProductId();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${appConfig.ttlApiHost}/api/v1/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  return (
    <ProductContext.Provider value={product}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  return useContext(ProductContext);
}
