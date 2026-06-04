"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import { type OrderDto } from "@/lib/interfaces/order";
import { VariantCard } from "./VariantCard";
import { OrderInform } from "./OrderInform";
import { StatusBadge } from "./StatusBadge";
import { Summary } from "./Summary";
import { Actions } from "./Actions";
import { useRouter } from "next/navigation";

type Props = {
  order: OrderDto;
};

export function OrderDetailBase({ order }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);

  return (
    <div>
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="text-neutral-400 my-3"
      >
        <ArrowLeft /> Quay Lại
      </Button>
      <div>
        <span className="font-serif text-lg">Đơn hàng: </span>
        <span className="flex flex-row gap-x-4 items-center">
          <h1 className="text-2xl font-bold">{order.id}</h1>
          <StatusBadge status={status} />
        </span>
      </div>
      <div className="grid grid-cols-4 gap-x-7 py-6 items-start">
        <div className="col-span-3">
          <OrderInform order={order} />
          <div className="flex flex-col gap-y-4 my-2">
            {order.orderDetails.map((v) => {
              return <VariantCard key={v.id} variant={v} />;
            })}
          </div>
        </div>
        <div>
          <Summary order={order} />
          <Actions status={status} setStatus={setStatus} orderId={order.id} />
        </div>
      </div>
    </div>
  );
}
