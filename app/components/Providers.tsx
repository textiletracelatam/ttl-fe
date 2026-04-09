"use client";

import { Suspense, useEffect, useState } from "react";
import { ProductProvider } from "../context/ProductContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // avoid hydration mismatch

  return (
    <Suspense>
      <ProductProvider>{children}</ProductProvider>
    </Suspense>
  );
}
