import { CollectionDetailBase } from "@/modules/management/collections/CollectionDetailBase";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CollectionDetailBase collectionId={id} />;
}
