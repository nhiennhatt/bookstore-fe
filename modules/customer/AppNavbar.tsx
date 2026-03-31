"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  KeyRound,
  LogOut,
  Package,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { useUser, useLoadingUser } from "@/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { logout } from "@/services/auth/logout";
import { useLoadUser } from "@/hooks";

const CATEGORY_LINKS = [
  { href: "/categories/van-hoc", label: "Văn học" },
  { href: "/categories/kinh-te", label: "Kinh tế" },
  { href: "/categories/thieu-nhi", label: "Thiếu nhi" },
  { href: "/categories/manga-light-novel", label: "Manga & Light novel" },
  { href: "/categories/ky-nang", label: "Kỹ năng" },
  { href: "/categories/lich-su", label: "Lịch sử" },
] as const;

export function AppNavbar() {
  const [user] = useUser();
  const [userLoading] = useLoadingUser();
  const router = useRouter();
  const loadUser = useLoadUser();

  const handleLogout = async () => {
    await logout();
    await loadUser();
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex h-full min-w-0 flex-1 items-center gap-x-4 lg:gap-x-8">
          <Link href="/" className="relative block shrink-0 self-stretch my-1">
            <Image
              src="/logo.webp"
              alt="Bookstore"
              className="object-contain h-full w-auto object-center"
              width={128}
              height={128}
              priority
            />
          </Link>

          <NavigationMenu className="max-w-none justify-start">
            <NavigationMenuList className="justify-start">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="gap-1">
                  Danh mục
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[min(92vw,420px)] gap-1 p-3 sm:w-[440px] sm:grid-cols-2">
                    {CATEGORY_LINKS.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink
                          href={item.href}
                          className="flex w-full items-center font-medium"
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
          <div className="relative w-[min(100%,10rem)] sm:w-full sm:max-w-[200px] md:max-w-xs lg:max-w-sm">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Tìm sách..."
              className="h-9 w-full pl-8"
              aria-label="Tìm sách"
            />
          </div>

          <Button type="button" variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="Giỏ hàng">
              <ShoppingCart className="size-5" />
            </Link>
          </Button>

          {!userLoading && user && (
            <NavigationMenu viewport={false}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-auto rounded-full bg-transparent p-0 hover:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent">
                    <span className="sr-only">Tài khoản</span>
                    <span className="size-9 shrink-0 overflow-hidden rounded-full border-2 border-border bg-muted/50">
                      <Image
                        src={user.avatar ?? "/default_avatar.webp"}
                        alt={user.username}
                        className="h-full w-full object-cover object-center"
                        width={32}
                        height={32}
                      />
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="right-0 left-auto min-w-56 p-2 md:right-0">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold uppercase">
                      @{user.username}
                    </div>
                    <ul className="space-y-1">
                      <li>
                        <NavigationMenuLink href="/user" className="gap-2">
                          <UserRound className="size-4 text-muted-foreground" />
                          Thông tin tài khoản
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink
                          href="/user/change-password"
                          className="gap-2"
                        >
                          <KeyRound className="size-4 text-muted-foreground" />
                          Đổi mật khẩu
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink href="/orders" className="gap-2">
                          <Package className="size-4 text-muted-foreground" />
                          Đơn hàng
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <button
                          className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1"
                          onClick={handleLogout}
                        >
                          <LogOut className="size-4 text-muted-foreground" />
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          )}
          {userLoading && (
            <Skeleton className="size-9 shrink-0 rounded-full border-2 border-border bg-white" />
          )}
          {!userLoading && !user && (
            <Button size="sm" className="hidden sm:inline-flex sm:h-8" asChild>
              <Link href="/auth">Đăng ký / Đăng nhập</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
