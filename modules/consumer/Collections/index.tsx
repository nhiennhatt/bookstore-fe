"use client";

import { Button } from "@/components/ui/button";
import { CollectionBooksCarouselSection } from "./CollectionBooksCarouselSection";
import { CollectionsPageHeader } from "./CollectionsPageHeader";
import { useCollectionsWithBooks } from "./useCollectionsWithBooks";

export function Collections() {
  const { collections, collectionBooks, handleLoadMore, hasMore } =
    useCollectionsWithBooks();

  const booksForCollection = (collectionId: string) =>
    collectionBooks.find((entry) => entry.collectionId === collectionId)
      ?.books ?? [];

  return (
    <main className="grow pt-24 pb-20 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <CollectionsPageHeader />

        <div className="space-y-20">
          {collections.map((collection, collectionIndex) => (
            <CollectionBooksCarouselSection
              key={collection.id}
              collection={collection}
              books={booksForCollection(collection.id)}
              collectionIndex={collectionIndex}
            />
          ))}
        </div>
        <div className="w-full flex justify-center">
          {hasMore && (
            <Button
              variant="outline"
              className="px-12 my-4 text-gray-700 text-lg font-light"
              size="lg"
              onClick={handleLoadMore}
            >
              Tải thêm
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
