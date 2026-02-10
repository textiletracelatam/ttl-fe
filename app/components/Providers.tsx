"use client";

import { Suspense, useEffect, useState } from "react";
import { ProductProvider } from "../context/ProductContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    import("../mocks/browser").then(({ worker }) =>
      worker.start({ onUnhandledRequest: "bypass" }).then(() => setReady(true))
    );
  }, []);

  if (!ready) return null;

  return (
    <Suspense>
      <ProductProvider>
        {children}
      </ProductProvider>
    </Suspense>
  );
}
