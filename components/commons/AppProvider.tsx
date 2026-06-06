"use client";

import { CartContext, LoadingUserContext, UserContext } from "@/lib/contexts";
import { StoredCartItem } from "@/lib/interfaces/cart";
import { User } from "@/lib/interfaces/user";
import { getUser } from "@/services/auth/getUser";
import { useEffect, useState } from "react";
import { Toaster } from "../ui/sonner";
import { TooltipProvider } from "../ui/tooltip";
import generateConnection from "@/services/auth/generateConnection";
import { is } from "zod/v4/locales";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingConnection, setLoadingConnection] = useState<boolean>(true);
  const [cart, setCart] = useState<StoredCartItem[]>([]);

  useEffect(() => {
    generateConnection()
      .then(() => setLoadingConnection(false))
      .catch(() => setLoadingConnection(false));
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (loadingConnection) return;

      try {
        setLoading(true);
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
    };
    fetchUser();
  }, [loadingConnection]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (!storedCart) return;
    try {
      setCart(JSON.parse(storedCart));
    } catch (error) {
      console.error(error);
      setCart([]);
    }
  }, []);

  if (loadingConnection) return null;

  return (
    <>
      <UserContext.Provider value={[user, setUser]}>
        <LoadingUserContext.Provider value={[loading, setLoading]}>
          <CartContext.Provider value={[cart, setCart]}>
            <TooltipProvider>{children}</TooltipProvider>
          </CartContext.Provider>
        </LoadingUserContext.Provider>
      </UserContext.Provider>
      <Toaster position="top-center" richColors />
    </>
  );
}
