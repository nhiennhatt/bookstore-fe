"use client";

import { useEffect, useState } from "react";
import type { BookCollection } from "@/lib/interfaces/collection";
import { getCollections } from "@/services/collections/getCollections";
import { CollectionItem } from "../components/CollectionItem";

export function CollectionsSection() {
  const [collections, setCollections] = useState<BookCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCollections = async () => {
      setIsLoading(true);
      try {
        const collectionsResponse = await getCollections({
          isPublic: true,
          page: 0,
          limit: 4,
        });
        if (isMounted) {
          setCollections(collectionsResponse.data ?? []);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setCollections([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCollections();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-vapor-white py-8 md:py-10 border-y border-border/30 overflow-hidden">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold uppercase">Bộ sưu tập</h2>
        <p className="text-cool-slate mt-2">
          Bộ sưu tập được chọn bởi người dùng.
        </p>
      </div>
      {isLoading && (
        <p className="mt-6 text-center text-sm text-cool-slate">Đang tải bộ sưu tập...</p>
      )}
      {collections.map((collection, index) => (
        <CollectionItem
          isFeatured={index === 0}
          key={collection.id}
          collection={collection}
        />
      ))}
    </section>
  );
}
