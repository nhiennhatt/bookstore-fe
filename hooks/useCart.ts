import { useContext, useEffect } from "react";
import { CartContext } from "../lib/contexts";
import { StoredCartItem } from "@/lib/interfaces/cart";

export function useCart() {
  const [cart, setCart] = useContext(CartContext);

  const addToCart = (item: StoredCartItem) => {
    const existingItem = cart.find((i) => i.id === item.id);
    const newCart = existingItem
      ? cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
        )
      : [...cart, item];

    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item,
    );
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart(newCart);
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
  };

  const countCartItems = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  return { cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart, countCartItems };
}
