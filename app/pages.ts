import type { ComponentType } from "react";
import HomeContent from "./[locale]/HomeContent";
import ProductDetailsContent from "./[locale]/product-details/ProductDetailsContent";

export type PageDef = {
  slug: string;
  name: string;
  content: ComponentType;
};

export const pages: PageDef[] = [
  { slug: "home", name: "Home", content: HomeContent },
  {
    slug: "product-details",
    name: "Product Details",
    content: ProductDetailsContent,
  },
];

export function pagePath(id: string, page: PageDef) {
  const base = page.slug === "home" ? "/" : `/${page.slug}`;
  return `${base}?id=${encodeURIComponent(id)}`;
}

export function slugFromPathname(pathname: string): string {
  if (pathname === "/") return "home";
  return pathname.replace(/^\//, "");
}
