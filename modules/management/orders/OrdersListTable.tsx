"use client";

import { Calendar, ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order } from "@/lib/interfaces/order";
import { cn } from "@/lib/utils/cn";
import { formatOrderPrice } from "@/modules/consumer/Order/orderFormat";
import { getOrderStatusInfo } from "@/modules/consumer/Order/orderStatus";
import { formatOrderListCreatedAt } from "./orderListUtils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type OrdersListTableProps = {
  orders: Order[];
  onRowClick: (orderId: string) => void;
};

export function OrdersListTable({ orders, onRowClick }: OrdersListTableProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead>Người nhận</TableHead>
            <TableHead>Mã vận đơn</TableHead>
            <TableHead>Mã thanh toán</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Tổng tiền</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <OrderTableRow
              key={order.id}
              order={order}
              onRowClick={onRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function OrderTableRow({
  order,
  onRowClick,
}: {
  order: Order;
  onRowClick: (orderId: string) => void;
}) {
  const statusInfo = getOrderStatusInfo(order.status);
  const recipient = order.address?.name ?? "—";
  const shortAddr = order.address
    ? `${order.address.ward}, ${order.address.district}`
    : "—";

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onRowClick(order.id)}
    >
      <TableCell className="font-mono text-xs font-medium">
        {order.id}
      </TableCell>
      <TableCell>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="size-3.5 shrink-0" />
          {formatOrderListCreatedAt(order.createdAt)}
        </span>
      </TableCell>
      <TableCell>
        <span className="block font-medium">{recipient}</span>
        <span className="line-clamp-1 text-xs text-muted-foreground">
          {shortAddr}
        </span>
      </TableCell>
      <TableCell className="">
        <Button
          className="w-full justify-start gap-1 font-mono text-orange-950 cursor-copy"
          onClick={(e) => {
            e.stopPropagation();
            void navigator.clipboard.writeText(order.deliveryCode ?? "");
            toast.success("Mã vận đơn đã được sao chép");
          }}
          variant="ghost"
        >
          <span className="font-medium">{order.deliveryCode}</span>
        </Button>
      </TableCell>
      <TableCell className="">
        {order.paymentCode && (
          <Button
            className="w-full justify-start gap-1 font-mono text-orange-950 cursor-copy"
            onClick={(e) => {
              e.stopPropagation();
              void navigator.clipboard.writeText(order.paymentCode ?? "");
              toast.success("Mã thanh toán đã được sao chép");
            }}
            variant="ghost"
          >
            <span className="font-medium">{order.paymentCode}</span>
          </Button>
        )}
      </TableCell>
      <TableCell>
        <Badge className={cn("gap-1 border shadow-none", statusInfo.color)}>
          {statusInfo.icon}
          {statusInfo.label}
        </Badge>
      </TableCell>
      <TableCell className="text-right font-semibold tabular-nums">
        {order.grandTotal != null ? formatOrderPrice(order.grandTotal) : "—"}
      </TableCell>
      <TableCell className="text-muted-foreground">
        <ChevronRight className="size-4" />
      </TableCell>
    </TableRow>
  );
}
