"use client";

import { MapPin, Phone, User as UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { UserAddress } from "@/lib/interfaces/address";

type Props = {
  address: UserAddress;
};

export function OrderShippingSection({ address }: Props) {
  return (
    <section className="bg-white rounded-3xl border border-border/50 p-8 shadow-sm space-y-6">
      <h2 className="text-lg font-bold text-deep-charcoal flex items-center gap-3">
        <MapPin size={18} className="text-electric-indigo" />
        Người nhận & Địa chỉ
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-vapor-white flex items-center justify-center text-electric-indigo shrink-0">
            <UserIcon size={18} />
          </div>
          <div>
            <span className="block text-sm font-bold text-deep-charcoal">
              {address.name}
            </span>
            <span className="text-xs text-cool-slate font-medium">
              Khách hàng
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-vapor-white flex items-center justify-center text-electric-indigo shrink-0">
            <Phone size={18} />
          </div>
          <span className="text-sm font-medium text-deep-charcoal">
            {address.phone}
          </span>
        </div>
        <Separator className="bg-border/30" />
        <p className="text-sm text-cool-slate leading-relaxed">
          {address.address}, {address.ward}, {address.district},{" "}
          {address.province}
        </p>
      </div>
    </section>
  );
}
