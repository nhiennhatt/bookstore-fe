import { Separator } from "@/components/ui/separator";
import { OrderDto } from "@/lib/interfaces/order";
import { parseAddressToString } from "@/lib/utils/parseAddressToString";
import { CreditCard, MapPin, Phone, Truck } from "lucide-react";

export function OrderInform({ order }: { order: OrderDto }) {
  return (
    <div className="w-full rounded-2xl bg-white  px-4 py-6 border border-neutral-200 flex flex-row gap-x-4">
      <div className="flex flex-row items-center gap-x-3 flex-1">
        <div className="basis-[max-content]">
          <MapPin size={15} />
        </div>
        <span className="text-neutral-500 text-sm">
          {parseAddressToString(order.address)}
        </span>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-row items-center gap-x-3 flex-1">
        <div className="basis-[max-content]">
          <Phone size={15} />
        </div>
        <span className="text-neutral-500 text-sm">{order.address.phone}</span>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-row items-center gap-x-3 flex-1">
        <div className="basis-[max-content]">
          <CreditCard size={15} />
        </div>
        <span className="text-neutral-500 text-sm">
          {order.paymentCode ?? "--"}
        </span>
      </div>
      <Separator orientation="vertical" />
      <div className="flex flex-row items-center gap-x-3 flex-1">
        <div className="basis-[max-content]">
          <Truck size={15} />
        </div>
        <span className="text-neutral-500 text-sm">
          {order.deliveryCode ?? "--"}
        </span>
      </div>
    </div>
  );
}
