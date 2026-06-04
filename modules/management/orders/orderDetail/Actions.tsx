import { Button } from "@/components/ui/button";
import {
  ORDER_STATUS_BG_COLORS,
  ORDER_STATUS_BORDER_COLORS,
  ORDER_STATUS_COLORS,
} from "@/lib/constants/orderStatusLabel";
import { OrderStatus } from "@/lib/interfaces/order";
import { cn } from "@/lib/utils";
import {
  commitOrderToDone,
  commitOrderToPrepared,
  commitOrderToShipping,
} from "@/services/orders";

export function Actions({
  status,
  setStatus,
  orderId,
}: {
  status: OrderStatus;
  setStatus: (status: OrderStatus) => void;
  orderId: string;
}) {
  const handleToPrepaired = () => {
    commitOrderToPrepared(orderId).then(() => {
      setStatus(OrderStatus.PREPARED);
    });
  };

  const handleToShipping = () => {
    commitOrderToShipping(orderId).then(() => {
      setStatus(OrderStatus.SHIPPING);
    });
  };

  const handleToDone = () => {
    commitOrderToDone(orderId).then(() => {
      setStatus(OrderStatus.DONE);
    });
  };

  return (
    <div className="flex flex-col gap-y-2 my-3">
      {status === OrderStatus.PREPARING && (
        <Button
          className={cn(
            "py-2",
            ORDER_STATUS_COLORS[OrderStatus.PREPARED],
            ORDER_STATUS_BG_COLORS[OrderStatus.PREPARED],
            ORDER_STATUS_BORDER_COLORS[OrderStatus.PREPARED],
          )}
          onClick={handleToPrepaired}
        >
          Đánh dấu đã đóng gói
        </Button>
      )}
      {status === OrderStatus.PREPARED && (
        <Button
          className={cn(
            "py-2",
            ORDER_STATUS_COLORS[OrderStatus.SHIPPING],
            ORDER_STATUS_BG_COLORS[OrderStatus.SHIPPING],
            ORDER_STATUS_BORDER_COLORS[OrderStatus.SHIPPING],
          )}
          onClick={handleToShipping}
        >
          Đánh dấu ĐVVC đã nhận hàng
        </Button>
      )}
      {status === OrderStatus.SHIPPING && (
        <Button
          className={cn(
            "py-2",
            ORDER_STATUS_COLORS[OrderStatus.DONE],
            ORDER_STATUS_BG_COLORS[OrderStatus.DONE],
            ORDER_STATUS_BORDER_COLORS[OrderStatus.DONE],
          )}
          onClick={handleToDone}
        >
          Đánh dấu đã hoàn thành
        </Button>
      )}
    </div>
  );
}
