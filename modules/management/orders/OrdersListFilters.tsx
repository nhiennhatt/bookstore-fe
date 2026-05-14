"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "@/lib/interfaces/order";
import {
  BOOL_ALL_VALUE,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
} from "./orderListConstants";

export type OrdersListFiltersProps = {
  statusFilter: OrderStatus | null;
  onStatusFilterChange: (value: OrderStatus | null) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  paymentCodeDraft: string;
  onPaymentCodeDraftChange: (value: string) => void;
  deliveryCodeDraft: string;
  onDeliveryCodeDraftChange: (value: string) => void;
  onClearFilters: () => void;
};

export function OrdersListFilters({
  statusFilter,
  onStatusFilterChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  paymentCodeDraft,
  onPaymentCodeDraftChange,
  deliveryCodeDraft,
  onDeliveryCodeDraftChange,
  onClearFilters,
}: OrdersListFiltersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="orders-filter-status"
          className="text-xs font-medium text-muted-foreground"
        >
          Trạng thái
        </Label>
        <Select
          value={statusFilter ?? BOOL_ALL_VALUE}
          onValueChange={(v) => {
            if (v === BOOL_ALL_VALUE) onStatusFilterChange(null);
            else onStatusFilterChange(v as OrderStatus);
          }}
        >
          <SelectTrigger id="orders-filter-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={BOOL_ALL_VALUE}>Tất cả</SelectItem>
            {ORDER_STATUS_OPTIONS.map((value) => (
              <SelectItem key={value} value={value}>
                {ORDER_STATUS_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="orders-filter-start"
          className="text-xs font-medium text-muted-foreground"
        >
          Từ ngày
        </Label>
        <Input
          id="orders-filter-start"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="orders-filter-end"
          className="text-xs font-medium text-muted-foreground"
        >
          Đến ngày
        </Label>
        <Input
          id="orders-filter-end"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="orders-filter-payment"
          className="text-xs font-medium text-muted-foreground"
        >
          Mã thanh toán
        </Label>
        <Input
          id="orders-filter-payment"
          value={paymentCodeDraft}
          onChange={(e) => onPaymentCodeDraftChange(e.target.value)}
          placeholder="Lọc theo mã…"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="orders-filter-delivery"
          className="text-xs font-medium text-muted-foreground"
        >
          Mã vận đơn
        </Label>
        <Input
          id="orders-filter-delivery"
          value={deliveryCodeDraft}
          onChange={(e) => onDeliveryCodeDraftChange(e.target.value)}
          placeholder="Lọc theo mã…"
        />
      </div>

      <div className="flex flex-col justify-end gap-1.5">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={onClearFilters}
        >
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  );
}
