"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ORDERS_PAGE_SIZE } from "@/lib/constants/ordersPagination";
import { MANAGEMENT_BASE } from "@/lib/constants/management-nav";
import type { Order, OrderStatus } from "@/lib/interfaces/order";
import { getAllOrders } from "@/services/orders";
import { ORDER_LIST_SEARCH_DEBOUNCE_MS } from "./orderListConstants";
import { mergeOrders, resolveNextPageState } from "./orderListUtils";
import { OrdersListEmpty } from "./OrdersListEmpty";
import { OrdersListFilters } from "./OrdersListFilters";
import { OrdersListHeader } from "./OrdersListHeader";
import { OrdersListSkeleton } from "./OrdersListSkeleton";
import { OrdersListTable } from "./OrdersListTable";

export function OrdersBase() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentCodeDraft, setPaymentCodeDraft] = useState("");
  const [deliveryCodeDraft, setDeliveryCodeDraft] = useState("");
  const [debouncedPaymentCode, setDebouncedPaymentCode] = useState("");
  const [debouncedDeliveryCode, setDebouncedDeliveryCode] = useState("");

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const nextCursorRef = useRef<string | null>(null);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedPaymentCode(paymentCodeDraft.trim());
    }, ORDER_LIST_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [paymentCodeDraft]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedDeliveryCode(deliveryCodeDraft.trim());
    }, ORDER_LIST_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [deliveryCodeDraft]);

  const loadOrders = useCallback(
    async (options?: { reset?: boolean }) => {
      const shouldReset = !!options?.reset;
      if (loadingRef.current) return;
      if (!shouldReset && !hasMoreRef.current) return;

      if (shouldReset) {
        setHasLoadedOnce(false);
        setOrders([]);
      }

      loadingRef.current = true;
      setIsLoadingMore(true);
      try {
        const cursorToUse = shouldReset ? null : nextCursorRef.current;
        const res = await getAllOrders({
          cursor: cursorToUse ?? undefined,
          limit: ORDERS_PAGE_SIZE,
          status: statusFilter ?? undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          paymentCode: debouncedPaymentCode || undefined,
          deliveryCode: debouncedDeliveryCode || undefined,
        });

        if (res.error) {
          console.error(res.error);
          return;
        }
        const raw = res.data;
        const items = Array.isArray(raw) ? raw : [];

        const nextPageState = resolveNextPageState(items, ORDERS_PAGE_SIZE);
        hasMoreRef.current = nextPageState.hasNextPage;
        nextCursorRef.current = nextPageState.nextCursor;

        setOrders((prev) => {
          if (shouldReset) return items;
          return mergeOrders(prev, items);
        });
        setHasLoadedOnce(true);
      } catch (e) {
        console.error(e);
      } finally {
        loadingRef.current = false;
        setIsLoadingMore(false);
      }
    },
    [
      debouncedDeliveryCode,
      debouncedPaymentCode,
      endDate,
      startDate,
      statusFilter,
    ],
  );

  useEffect(() => {
    hasMoreRef.current = true;
    nextCursorRef.current = null;
    void loadOrders({ reset: true });
  }, [loadOrders]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        void loadOrders();
      },
      {
        root: null,
        rootMargin: "320px 0px 320px 0px",
        threshold: 0,
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadOrders]);

  useEffect(() => {
    if (isLoadingMore) return;
    if (!hasMoreRef.current) return;

    const target = loadMoreRef.current;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const isNearViewportBottom = rect.top <= window.innerHeight + 320;
    if (!isNearViewportBottom) return;

    void loadOrders();
  }, [orders.length, isLoadingMore, loadOrders]);

  const showInitialSkeleton = !hasLoadedOnce && isLoadingMore;

  const handleClearFilters = () => {
    setStatusFilter(null);
    setStartDate("");
    setEndDate("");
    setPaymentCodeDraft("");
    setDeliveryCodeDraft("");
    setDebouncedPaymentCode("");
    setDebouncedDeliveryCode("");
  };

  const navigateToOrder = useCallback(
    (orderId: string) => {
      router.push(`${MANAGEMENT_BASE}/orders/${orderId}`);
    },
    [router],
  );

  return (
    <div className="flex flex-col gap-6">
      <OrdersListHeader />

      <OrdersListFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        paymentCodeDraft={paymentCodeDraft}
        onPaymentCodeDraftChange={setPaymentCodeDraft}
        deliveryCodeDraft={deliveryCodeDraft}
        onDeliveryCodeDraftChange={setDeliveryCodeDraft}
        onClearFilters={handleClearFilters}
      />

      {showInitialSkeleton ? (
        <OrdersListSkeleton />
      ) : orders.length === 0 ? (
        <OrdersListEmpty />
      ) : (
        <OrdersListTable orders={orders} onRowClick={navigateToOrder} />
      )}

      <div ref={loadMoreRef} aria-hidden className="h-8 w-full shrink-0" />

      {hasLoadedOnce && isLoadingMore && orders.length > 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          Đang tải thêm…
        </p>
      ) : null}
    </div>
  );
}
