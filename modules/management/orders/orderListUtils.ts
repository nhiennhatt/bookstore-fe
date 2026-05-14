import type { Order } from "@/lib/interfaces/order";

export function resolveNextPageState(items: Order[], pageSize: number) {
  const tailId =
    items.length > 0 ? items[items.length - 1]?.id ?? null : null;
  const hasNextPage = items.length >= pageSize && Boolean(tailId);

  return {
    hasNextPage,
    nextCursor: hasNextPage ? tailId : null,
  };
}

export function mergeOrders(prev: Order[], next: Order[]) {
  const seen = new Set(prev.map((o) => o.id));
  const appended = next.filter((o) => !seen.has(o.id));
  return [...prev, ...appended];
}

export function formatOrderListCreatedAt(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}
