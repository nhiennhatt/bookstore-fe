"use client";

import { usePathname } from "next/navigation";

import { getManagementPageTitle } from "@/lib/constants/management-nav";

export function ManagementHeaderTitle() {
  const pathname = usePathname();
  const title = getManagementPageTitle(pathname);

  return (
    <h1 className="font-heading text-lg font-semibold tracking-tight text-foreground">
      {title}
    </h1>
  );
}
