"use client";

import { LoadingUserContext, UserContext } from "@/lib/contexts";
import { User } from "@/lib/interfaces/user";
import { getUser } from "@/services/auth/getUser";
import { useEffect, useState } from "react";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await getUser();
        setUser(user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <LoadingUserContext.Provider value={[loading, setLoading]}>
        {children}
      </LoadingUserContext.Provider>
    </UserContext.Provider>
  );
}
