"use client";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function GoBackButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="gap-2"
      onClick={() => window.history.back()}
    >
      <ArrowLeft className="size-4" aria-hidden />
      Quay lại
    </Button>
  );
}
