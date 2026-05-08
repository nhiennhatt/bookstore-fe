"use client";

import { Search, Heart, ShoppingCart, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLoadingUser, useLoadUser, useUser } from "@/hooks";
import { useRouter } from "next/navigation";
import { logout } from "@/services/auth/logout";

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
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="text-2xl font-bold tracking-tighter text-deep-charcoal"
          >
            Lumina
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a
              href="#"
              className="text-electric-indigo underline underline-offset-4 decoration-2"
            >
              Cửa hàng
            </a>
            <a
              href="#"
              className="text-cool-slate hover:text-deep-charcoal transition-colors"
            >
              Bộ sưu tập
            </a>
            <a
              href="#"
              className="text-cool-slate hover:text-deep-charcoal transition-colors"
            >
              Sách mới
            </a>
            <a
              href="#"
              className="text-cool-slate hover:text-deep-charcoal transition-colors"
            >
              Tạp chí
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
            size="icon"
            className="text-cool-slate hover:text-electric-indigo"
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-cool-slate hover:text-electric-indigo"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-cool-slate hover:text-electric-indigo"
          >
            <User className="h-5 w-5" />
          </Button>
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
