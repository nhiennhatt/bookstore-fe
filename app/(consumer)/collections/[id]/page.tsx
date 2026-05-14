import { CollectionDetail } from "@/modules/consumer/Collections/CollectionDetail";
import { getBookCollectionById } from "@/services/collections";
import { notFound } from "next/navigation";

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: collection, error } = await getBookCollectionById(id);

  if (error || !collection) {
    return notFound();
  }
  
  return <CollectionDetail collection={collection} />;
}