"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { appConfig } from "../config";

const TOKEN_STORAGE_KEY = "ttl_admin_id_token";

type AuthContextValue = {
  /** The Cognito ID token, or null when signed out. Send as-is (no
   * "Bearer " prefix) in the Authorization header — that's what API
   * Gateway's Cognito authorizer expects. */
  token: string | null;
  /** True until the stored token (if any) has been read from
   * localStorage, so callers can avoid a flash of the logged-out state. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setToken(localStorage.getItem(TOKEN_STORAGE_KEY));
    } catch {
      // localStorage unavailable (private browsing, blocked storage) —
      // just stay signed out rather than crash.
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const client = new CognitoIdentityProviderClient({
      region: appConfig.cognitoRegion,
    });

    const result = await client.send(
      new InitiateAuthCommand({
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: appConfig.cognitoClientId,
        AuthParameters: { USERNAME: email, PASSWORD: password },
      }),
    );

    const idToken = result.AuthenticationResult?.IdToken;

    if (!idToken) {
      throw new Error("Sign-in did not return a token.");
    }

    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, idToken);
    } catch {
      // Token still works for this session via state even if it can't
      // persist across reloads.
    }

    setToken(idToken);
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // ignore
    }

    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}
