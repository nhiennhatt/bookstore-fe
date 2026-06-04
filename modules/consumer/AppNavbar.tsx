"use client";

import { Search, ShoppingCart, User, Menu, LogOut, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoadUser, useUser } from "@/hooks";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/services/auth/logout";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function AppNavbar() {
  const [user] = useUser();
  const router = useRouter();
  const loadUser = useLoadUser();
  const pathname = usePathname();
  const handleLogout = async () => {
    await logout();
    await loadUser();
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="text-2xl font-bold tracking-tighter text-deep-charcoal"
          >
            Bookshop
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a
              href="/collections"
              className={cn(
                "text-cool-slate hover:text-deep-charcoal transition-colors",
                /^\/collections(\/.*)?$/.test(pathname)
                  ? "text-electric-indigo"
                  : "",
              )}
            >
              Bộ sưu tập
            </a>
            <a
              href="/categories"
              className={cn(
                "text-cool-slate hover:text-deep-charcoal transition-colors",
                pathname === "/categories" ? "text-electric-indigo" : "",
              )}
            >
              Danh mục
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center relative group">
            <Search className="absolute left-3 h-4 w-4 text-cool-slate group-focus-within:text-electric-indigo transition-colors" />
            <Input
              placeholder="Tìm kiếm tác giả, tựa sách..."
              className="pl-9 w-64 bg-muted border-none rounded-full h-9 focus-visible:ring-1 focus-visible:ring-electric-indigo"
            />
          </div>
          <Button
            variant="ghost"
            className="text-cool-slate hover:text-electric-indigo"
            asChild
          >
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-cool-slate hover:text-electric-indigo"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-44" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="h-5 w-5" />
                      Thông tin tài khoản
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <List className="h-5 w-5" />
                      Lịch sử đơn hàng
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    variant="destructive"
                  >
                    <LogOut className="h-5 w-5" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {!user && (
            <Link href="/auth">
              <Button
                variant="outline"
                className="text-cool-slate hover:text-electric-indigo"
              >
                Đăng nhập
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-cool-slate"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
