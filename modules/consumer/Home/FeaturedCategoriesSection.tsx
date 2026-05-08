"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/lib/interfaces/category";
import { getCategories } from "@/services/categories/getCategories";
import { FeaturedCategoryItem } from "../components/FeaturedCategoryItem";

const FEATURED_CATEGORY_LIMIT = 4;

export function FeaturedCategoriesSection() {
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchFeaturedCategories = async () => {
      setIsLoading(true);
      try {
        const categoriesResponse = await getCategories({
          isPublic: true,
          isFeatured: true,
          limit: FEATURED_CATEGORY_LIMIT,
        });
        const fetchedCategories = categoriesResponse.data ?? [];

        if (mounted) {
          setFeaturedCategories(fetchedCategories);
        }
      } catch (error) {
        console.error("FeaturedCategoriesSection:", error);
        if (mounted) {
          setFeaturedCategories([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchFeaturedCategories();
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return null;
  }

  if (!featuredCategories.length) {
    return null;
  }

  return (
    <section className="bg-vapor-white py-10 md:py-12 border-y border-border/30">
      <div className="container mx-auto px-4 space-y-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold uppercase">Danh mục nổi bật</h2>
          <p className="text-cool-slate mt-2">
            Danh mục nổi bật được chọn bởi người dùng.
          </p>
        </div>

        {featuredCategories.map((category) => (
          <FeaturedCategoryItem key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
