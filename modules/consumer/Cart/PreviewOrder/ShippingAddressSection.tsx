"use client";

import React from "react";
import { MapPin, CheckCircle2 } from "lucide-react";
import { UserAddress } from "@/lib/interfaces/address";
import Link from "next/link";

interface ShippingAddressSectionProps {
  addresses: UserAddress[];
  selectedAddressId: string | null;
  onSelectAddress: (id: string) => void;
}

export function ShippingAddressSection({
  addresses,
  selectedAddressId,
  onSelectAddress,
}: ShippingAddressSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-deep-charcoal flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-electric-indigo text-white flex items-center justify-center text-sm">
            1
          </span>
          Địa chỉ giao hàng
        </h2>
        <Link
          href="/profile?isAddress=true"
          className="text-xs font-bold text-electric-indigo uppercase tracking-widest hover:underline"
        >
          Quản lý địa chỉ
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <button
            key={addr.id}
            onClick={() => onSelectAddress(addr.id)}
            className={`text-left p-6 rounded-2xl border transition-all relative ${
              selectedAddressId === addr.id
                ? "border-electric-indigo bg-indigo-50/30 ring-1 ring-electric-indigo shadow-sm"
                : "border-border/50 hover:border-cool-slate/50 bg-white"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="font-bold text-deep-charcoal">{addr.name}</span>
              {selectedAddressId === addr.id && (
                <CheckCircle2
                  size={18}
                  className="text-electric-indigo shrink-0"
                />
              )}
            </div>
            <div className="flex items-start gap-2 text-sm text-cool-slate leading-relaxed mb-3">
              <MapPin size={14} className="mt-1 shrink-0 opacity-60" />
              <span className="line-clamp-2">
                {addr.address}, {addr.ward}, {addr.district}, {addr.province}
              </span>
            </div>
            <span className="block text-xs font-bold text-deep-charcoal opacity-70">
              SĐT: {addr.phone}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
