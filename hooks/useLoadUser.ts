import { useCallback } from "react";

import { getUser } from "@/services/auth/getUser";

import { useUser } from "./useUser";
import { useLoadingUser } from "./useLoadingUser";

export function useLoadUser() {
  const [, setUser] = useUser();
  const [, setLoading] = useLoadingUser();

  return useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUser();
      if (res.error) {
        setUser(null);
        return;
      }
      setUser(res.data ?? null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);
}
