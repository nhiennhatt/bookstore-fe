import { useContext } from "react";
import { LoadingUserContext } from "../lib/contexts";

export function useLoadingUser() {
  const loading = useContext(LoadingUserContext);
  return loading;
}
