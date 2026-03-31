import Link from "next/link";
import { BookX, Home } from "lucide-react";

import { GoBackButton } from "@/components/commons/GoBackButton";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.488_0.243_264.376/0.12),transparent)]"
      />
      <div className="relative mx-auto w-full max-w-md text-center">
        <div className="mb-8 inline-flex size-20 items-center justify-center rounded-2xl border border-border/80 bg-card shadow-sm">
          <BookX
            className="size-9 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
        <p className="font-heading text-7xl font-semibold tracking-tight text-primary sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
          Không tìm thấy trang
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground leading-relaxed">
          Đường dẫn này không tồn tại hoặc đã được chuyển đi. Bạn có thể quay lại
          trang chủ hoặc dùng menu để tiếp tục mua sắm.
        </p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <Home className="size-4" aria-hidden />
              Về trang chủ
            </Link>
          </Button>
          <GoBackButton />
        </div>
      </div>
    </div>
  );
}
