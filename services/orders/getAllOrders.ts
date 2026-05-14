"use server";

import type { APIResponse } from "@/lib/interfaces/common";
import type { Order, OrderStatus } from "@/lib/interfaces/order";
import serverSecurityAxios from "@/lib/server/serverAxios";
import { callAPIWrapper } from "@/lib/utils/callAPIWrapper";

/** GET /orders — danh sách đơn (admin / nội bộ theo backend) */
export type GetAllOrdersQuery = {
  cursor?: string;
  status?: OrderStatus;
  paymentCode?: string;
  deliveryCode?: string;
  districtId?: number;
  provinceId?: number;
  wardCode?: string;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

export async function getAllOrders(
  query?: GetAllOrdersQuery,
): Promise<APIResponse<Order[]>> {
  return callAPIWrapper(() =>
    serverSecurityAxios.get<Order[]>("/orders", {
      params: query,
    }),
  );
}
