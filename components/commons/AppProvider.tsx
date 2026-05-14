"use client";

import { CartContext, LoadingUserContext, UserContext } from "@/lib/contexts";
import { StoredCartItem } from "@/lib/interfaces/cart";
import { User } from "@/lib/interfaces/user";
import { getUser } from "@/services/auth/getUser";
import { useEffect, useMemo, useState } from "react";
import { Toaster } from "../ui/sonner";
import { TooltipProvider } from "../ui/tooltip";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cart, setCart] = useState<StoredCartItem[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
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
  }, []);

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
