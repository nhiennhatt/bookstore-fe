export const MANAGEMENT_BASE = "/management" as const;

export const MANAGEMENT_ROUTES = [
  {
    key: "overview",
    href: MANAGEMENT_BASE,
    label: "Tổng quan",
    isOverview: true as const,
  },
  {
    key: "categories",
    href: `${MANAGEMENT_BASE}/categories`,
    label: "Danh mục",
    isOverview: false as const,
  },
  {
    key: "books",
    href: `${MANAGEMENT_BASE}/books`,
    label: "Sách",
    isOverview: false as const,
  },
  {
    key: "orders",
    href: `${MANAGEMENT_BASE}/orders`,
    label: "Đơn hàng",
    isOverview: false as const,
  },
  {
    key: "collections",
    href: `${MANAGEMENT_BASE}/collections`,
    label: "Bộ sưu tập",
    isOverview: false as const,
  },
  {
    key: "campaigns",
    href: `${MANAGEMENT_BASE}/campaigns`,
    label: "Chiến dịch",
    isOverview: false as const,
  },
  {
    key: "coupons",
    href: `${MANAGEMENT_BASE}/coupons`,
    label: "Mã giảm giá",
    isOverview: false as const,
  },
  {
    key: "users",
    href: `${MANAGEMENT_BASE}/users`,
    label: "Người dùng",
    isOverview: false as const,
  },
  {
    key: "reviews",
    href: `${MANAGEMENT_BASE}/reviews`,
    label: "Đánh giá",
    isOverview: false as const,
  },
] as const;

export type ManagementRouteKey = (typeof MANAGEMENT_ROUTES)[number]["key"];

export function normalizeManagementPath(pathname: string) {
  return pathname.replace(/\/$/, "") || "/";
}

export function managementPathMatches(
  pathname: string,
  href: string,
  isOverview: boolean,
) {
  const p = normalizeManagementPath(pathname);
  const h = normalizeManagementPath(href);
  if (isOverview) return p === h;
  return p === h || p.startsWith(`${h}/`);
}

export function getManagementPageTitle(pathname: string) {
  const p = normalizeManagementPath(pathname);
  for (const item of MANAGEMENT_ROUTES) {
    if (managementPathMatches(p, item.href, item.isOverview)) {
      return item.label;
    }
  }
  if (p.startsWith(MANAGEMENT_BASE)) {
    return "Quản lý";
  }
  return "Quản lý";
}
