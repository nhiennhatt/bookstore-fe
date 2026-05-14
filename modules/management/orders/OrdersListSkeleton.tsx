import { Skeleton } from "@/components/ui/skeleton";

export function OrdersListSkeleton() {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
