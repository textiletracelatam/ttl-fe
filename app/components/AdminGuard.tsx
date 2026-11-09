"use client";

import { useEffect } from "react";
import { useRouter } from "@/navigation";
import { useAuth } from "@/app/context/AuthContext";
import AdminTopBar from "@/app/components/AdminTopBar";

/**
 * Wraps every admin page except the login page itself. Redirects to
 * /admin/login when there's no token — this is UX only: the real
 * enforcement is the Cognito authorizer API Gateway attaches to
 * /api/v1/passports/* (see lib/dev-ttl-stack.ts in ttl-iac-be), since a
 * static-export frontend has no server to enforce anything at request
 * time. Also renders the shared top bar (currently just Log out) so every
 * guarded page gets it without repeating the markup.
 */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/admin/login");
    }
  }, [isLoading, token, router]);

  if (isLoading || !token) return null;

  return (
    <>
      <AdminTopBar />
      {children}
    </>
  );
}
