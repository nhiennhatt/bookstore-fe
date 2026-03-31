"use client";
import { ManagementSidebar } from "@/modules/management/ManagementSidebar";
import { ManagementHeaderTitle } from "@/modules/management/ManagementHeaderTitle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { notFound } from "next/navigation";
import { UserRole } from "@/lib/interfaces/user";
import { useLoadingUser, useUser } from "@/hooks";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user] = useUser();
  const [userLoading] = useLoadingUser();

  if (userLoading) {
    return <div>Loading...</div>;
  }

  if (!userLoading && (!user || user.role === UserRole.CUSTOMER)) {
    return notFound();
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <ManagementSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-1 h-full" />
            <ManagementHeaderTitle />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
