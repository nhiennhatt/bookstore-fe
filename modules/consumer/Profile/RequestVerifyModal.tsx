"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sendVerifyCode } from "@/services/me";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function RequestVerifyModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    await sendVerifyCode();
    setLoading(false);
    router.push("/verify-account");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle asChild>
            <h1 className="text-2xl! font-bold">Xác minh tài khoản</h1>
          </DialogTitle>
          <DialogDescription>
            {loading ? "Đang gửi..." : "Bạn có muốn gửi email xác minh?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button onClick={handleSend} disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi email xác minh"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
