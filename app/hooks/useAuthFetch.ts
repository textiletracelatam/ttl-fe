"use client";

import { useCallback } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps fetch() with the Authorization header the admin/passport endpoints
 * expect — the bare Cognito ID token (API Gateway's Cognito authorizer
 * reads it directly, no "Bearer " prefix). On a 401/403 it logs out, so a
 * stale or expired token self-corrects into AdminGuard's login redirect.
 */
export function useAuthFetch() {
  const { token, logout } = useAuth();

  return useCallback(
    async (url: string, init: RequestInit = {}) => {
      const headers = new Headers(init.headers);

      if (token) {
        headers.set("Authorization", token);
      }

      const response = await fetch(url, { ...init, headers });

      if (response.status === 401 || response.status === 403) {
        logout();
      }

      return response;
    },
    [token, logout],
  );
}
