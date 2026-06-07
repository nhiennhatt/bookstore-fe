"use client";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyAccount } from "@/services/me";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { useState } from "react";

const isDigitsOnly = (str: string) => /^\d+$/.test(str);

export function VerifyCode() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [invalid, setInvalid] = useState(false);

  const handleVerify = () => {
    if (code.length !== 8 || !isDigitsOnly(code)) {
      setInvalid(true);
      return;
    }
    setLoading(true);
    setInvalid(false);
    verifyAccount({ code })
      .then((res) => {
        if (res.error) {
          setInvalid(true);
        } else {
          router.refresh();
          router.push("/profile");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main className="grow pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-5xl space-y-5">
        <h1 className="text-3xl! font-bold">Xác minh tài khoản</h1>
        <div className="flex flex-col items-center justify-center">
          <InputOTP
            maxLength={8}
            pattern={REGEXP_ONLY_DIGITS}
            onChange={setCode}
            disabled={loading}
          >
            <InputOTPGroup className="*:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:text-xl">
              <InputOTPSlot index={0} aria-invalid={invalid} />
              <InputOTPSlot index={1} aria-invalid={invalid} />
              <InputOTPSlot index={2} aria-invalid={invalid} />
              <InputOTPSlot index={3} aria-invalid={invalid} />
              <InputOTPSlot index={4} aria-invalid={invalid} />
              <InputOTPSlot index={5} aria-invalid={invalid} />
              <InputOTPSlot index={6} aria-invalid={invalid} />
              <InputOTPSlot index={7} aria-invalid={invalid} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button size="lg" onClick={handleVerify} disabled={loading}>
          {loading ? "Đang xác minh..." : "Xác minh"}
        </Button>
      </div>
    </main>
  );
}
