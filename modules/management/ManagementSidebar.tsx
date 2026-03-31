"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ExternalLink,
  FolderTree,
  LayoutDashboard,
  Library,
  Megaphone,
  ShoppingCart,
  Star,
  Ticket,
  Users,
} from "lucide-react";

import {
  MANAGEMENT_BASE,
  MANAGEMENT_ROUTES,
  type ManagementRouteKey,
  managementPathMatches,
} from "@/lib/constants/management-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

const ROUTE_ICONS: Record<ManagementRouteKey, LucideIcon> = {
  overview: LayoutDashboard,
  categories: FolderTree,
  books: BookOpen,
  orders: ShoppingCart,
  collections: Library,
  campaigns: Megaphone,
  coupons: Ticket,
  users: Users,
  reviews: Star,
};

export function ManagementSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Admin">
              <Link href={MANAGEMENT_BASE}>
                <Image
                  src="/logo.webp"
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 object-contain"
                />
                <span className="truncate font-semibold font-heading text-base md:text-lg">
                  Bookshop Admin
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MANAGEMENT_ROUTES.map((item) => {
                const active = managementPathMatches(
                  pathname,
                  item.href,
                  item.isOverview,
                );
                const Icon = ROUTE_ICONS[item.key];
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" asChild tooltip="Storefront">
              <Link href="/">
                <ExternalLink />
                <span>View site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
