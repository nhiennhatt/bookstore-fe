import { useContext } from "react";
import { UserContext } from "../lib/contexts";

export function useUser() {
  const user = useContext(UserContext);
  return user;
}