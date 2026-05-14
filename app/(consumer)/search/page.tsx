import { Search } from "@/modules/consumer/Search";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; category?: string }>;
}) {
  const { query, category } = await searchParams;
  return <Search query={query} categorySlug={category} />;
}
