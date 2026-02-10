import type { ComponentType } from "react";
import HomeContent from "./HomeContent";
import ProductDetailsContent from "./product-details/ProductDetailsContent";

export type PageDef = {
  /** Relative path (no id prefix) */
  path: string;
  slug: string;
  name: string;
  content: ComponentType;
};

export const pages: PageDef[] = [
  { path: "/", slug: "home", name: "Home", content: HomeContent },
  { path: "/product-details", slug: "product-details", name: "Product Details", content: ProductDetailsContent },
];

/** Build the full path for a page given the product id */
export function pagePath(id: string, page: PageDef) {
  return `${page.path}?id=${encodeURIComponent(id)}`;
}
