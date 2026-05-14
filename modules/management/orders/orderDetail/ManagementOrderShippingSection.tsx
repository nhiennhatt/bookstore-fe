"use client";

import { MapPin, Phone, User } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import type { UserAddress } from "@/lib/interfaces/address";

type Props = {
  address: UserAddress;
};

export function ManagementOrderShippingSection({ address }: Props) {
  return (
    <section className="space-y-4 rounded-lg border bg-card p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <MapPin className="size-5 text-muted-foreground" />
        Người nhận & địa chỉ
      </h2>
      <div className="space-y-4 text-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
            <User className="size-[18px]" />
          </div>
          <div>
            <span className="block font-medium text-foreground">
              {address.name}
            </span>
            <span className="text-xs text-muted-foreground">Người nhận</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
            <Phone className="size-[18px]" />
          </div>
          <span className="font-medium">{address.phone}</span>
        </div>
        <Separator />
        <p className="leading-relaxed text-muted-foreground">
          {address.address}, {address.ward}, {address.district},{" "}
          {address.province}
        </p>
      </div>
    </section>
  );
}
