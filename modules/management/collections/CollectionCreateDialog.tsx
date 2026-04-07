"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { BookCollection } from "@/lib/interfaces/collection";

export function CollectionCreateDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: Pick<BookCollection, "name" | "public">) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName("");
    setIsPublic(true);
    setIsSubmitting(false);
  }, [open]);

  const handleSubmit = async () => {
    const nextName = name.trim();
    if (!nextName || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: nextName,
        public: isPublic,
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo bộ sưu tập</DialogTitle>
          <DialogDescription>Thêm bộ sưu tập mới để hiển thị ở storefront.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="create-collection-name">Tên bộ sưu tập</Label>
            <Input
              id="create-collection-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên bộ sưu tập"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            <Label>Công khai</Label>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            type="button"
            disabled={!name.trim() || isSubmitting}
            onClick={handleSubmit}
          >
            Tạo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
