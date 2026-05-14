import { useEffect, useState } from "react";
import { CollectionBookOverview } from "@/lib/interfaces/collection-book";
import { BookCollection } from "@/lib/interfaces/collection";
import { getCollectionBooks, getCollections } from "@/services/collections";

export type CollectionBooksEntry = {
  collectionId: string;
  books: CollectionBookOverview[];
};

const COLLECTION_BOOKS_PAGE_SIZE = 2;

export function useCollectionsWithBooks() {
  const [collections, setCollections] = useState<BookCollection[]>([]);
  const [collectionBooks, setCollectionBooks] = useState<
    CollectionBooksEntry[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchCollections = async () => {
      const collectionsResponse = await getCollections({
        limit: COLLECTION_BOOKS_PAGE_SIZE,
      });
      if (collectionsResponse.error || !collectionsResponse.data) {
        setCollections([]);
        return;
      }
      setCollections(collectionsResponse.data);
      setHasMore(
        collectionsResponse.data.length === COLLECTION_BOOKS_PAGE_SIZE,
      );
      if (collectionsResponse.data.length > 0) {
        setPage(page + 1);
      }

      const _collectionBooks = await Promise.all(
        collectionsResponse.data.map(async (collection) => {
          const collectionBooksResponse = await getCollectionBooks(
            collection.id,
            { limit: 10 },
          );
          if (collectionBooksResponse.error || !collectionBooksResponse.data) {
            return {
              collectionId: collection.id,
              books: [],
            };
          }
          return {
            collectionId: collection.id,
            books: collectionBooksResponse.data,
          };
        }),
      );
      setIsLoading(false);

      setCollectionBooks(_collectionBooks);
    };
    fetchCollections();
  }, []);

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    const res = await getCollections({
      page,
      limit: COLLECTION_BOOKS_PAGE_SIZE,
    });
    if (res.error || !res.data) {
      setHasMore(false);
      return;
    }
    setCollections([...collections, ...res.data]);
    setHasMore(res.data.length === COLLECTION_BOOKS_PAGE_SIZE);
    setPage(page + 1);
    const _collectionBooks = await Promise.all(
      res.data.map(async (collection) => {
        const collectionBooksResponse = await getCollectionBooks(
          collection.id,
          { limit: 10 },
        );
        if (collectionBooksResponse.error || !collectionBooksResponse.data) {
          return {
            collectionId: collection.id,
            books: [],
          };
        }
        return {
          collectionId: collection.id,
          books: collectionBooksResponse.data,
        };
      }),
    );
    setIsLoading(false);

    setCollectionBooks([
      ...collectionBooks,
      ..._collectionBooks.filter((entry) => entry !== undefined),
    ]);
  };

  return { collections, collectionBooks, hasMore, handleLoadMore };
}
