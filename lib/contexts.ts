import { createContext, Dispatch, SetStateAction } from "react";
import { User } from "./interfaces/user";

export const UserContext = createContext<
  [User | null, Dispatch<SetStateAction<User | null>>]
>([null, () => {}]);

export const LoadingUserContext = createContext<
  [boolean, Dispatch<SetStateAction<boolean>>]
>([true, () => {}]);
