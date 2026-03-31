export const MANAGEMENT_BASE = "/management" as const;

export const MANAGEMENT_ROUTES = [
  {
    key: "overview",
    href: MANAGEMENT_BASE,
    label: "Overview",
    isOverview: true as const,
  },
  {
    key: "categories",
    href: `${MANAGEMENT_BASE}/categories`,
    label: "Categories",
    isOverview: false as const,
  },
  {
    key: "books",
    href: `${MANAGEMENT_BASE}/books`,
    label: "Books",
    isOverview: false as const,
  },
  {
    key: "orders",
    href: `${MANAGEMENT_BASE}/orders`,
    label: "Orders",
    isOverview: false as const,
  },
  {
    key: "collections",
    href: `${MANAGEMENT_BASE}/collections`,
    label: "Collections",
    isOverview: false as const,
  },
  {
    key: "campaigns",
    href: `${MANAGEMENT_BASE}/campaigns`,
    label: "Campaigns",
    isOverview: false as const,
  },
  {
    key: "coupons",
    href: `${MANAGEMENT_BASE}/coupons`,
    label: "Coupons",
    isOverview: false as const,
  },
  {
    key: "users",
    href: `${MANAGEMENT_BASE}/users`,
    label: "Users",
    isOverview: false as const,
  },
  {
    key: "reviews",
    href: `${MANAGEMENT_BASE}/reviews`,
    label: "Reviews",
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
    return "Management";
  }
  return "Management";
}
