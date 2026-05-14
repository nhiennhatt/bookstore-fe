"use client";

import React from "react";
import { CreditCard } from "lucide-react";

export function PaymentMethodSection() {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-deep-charcoal flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-electric-indigo text-white flex items-center justify-center text-sm">
          2
        </span>
        Phương thức thanh toán
      </h2>

      <div className="space-y-3">
        <button className="w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left border-electric-indigo bg-indigo-50/30 ring-1 ring-electric-indigo shadow-sm">
          <div className="bg-electric-indigo text-white">
            <CreditCard size={20} />
          </div>
          <div>
            <span className="block font-bold text-deep-charcoal">
              Thẻ Tín dụng / Ghi nợ
            </span>
            <span className="text-xs text-cool-slate font-medium">
              Hỗ trợ Visa, Mastercard, JCB
            </span>
          </div>
          <div className="ml-auto">
            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-electric-indigo">
              <div className="w-2.5 h-2.5 rounded-full bg-electric-indigo" />
            </div>
          </div>
        </button>
      </div>
    </section>
  );
}
