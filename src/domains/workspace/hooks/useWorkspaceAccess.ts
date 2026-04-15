"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_providers/AuthProvider";

import type { UseWorkspaceAccessResult } from "@/domains/workspace/types";

export function useWorkspaceAccess(): UseWorkspaceAccessResult {
  const router = useRouter();
  const { isAuthenticated, refreshSession } = useAuth();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function guardWorkspaceRoute() {
      if (isAuthenticated) {
        if (isActive) {
          setHasAccess(true);
          setIsCheckingAccess(false);
        }
        return;
      }

      const didRefreshSucceed = await refreshSession();

      if (!isActive) {
        return;
      }

      if (!didRefreshSucceed) {
        setHasAccess(false);
        setIsCheckingAccess(false);
        router.replace("/sign-in");
        return;
      }

      setHasAccess(true);
      setIsCheckingAccess(false);
    }

    void guardWorkspaceRoute();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, refreshSession, router]);

  return {
    isCheckingAccess,
    hasAccess,
  };
}
