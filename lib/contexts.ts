import { createContext, Dispatch, SetStateAction } from "react";
import { User } from "./interfaces/user";
import { StoredCartItem } from "./interfaces/cart";

export const UserContext = createContext<
  [User | null, Dispatch<SetStateAction<User | null>>]
>([null, () => {}]);

export const LoadingUserContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>([true, () => {}]);

export const CartContext = createContext<
  [StoredCartItem[], Dispatch<SetStateAction<StoredCartItem[]>>]
>([[], () => {}]);