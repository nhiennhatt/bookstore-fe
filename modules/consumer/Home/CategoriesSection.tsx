import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/interfaces/category";
import { CategoryItem } from "../components/CategoryItem";
import { getCategories } from "@/services/categories/getCategories";

export async function CategoriesSection() {
  let categories: Category[] = [];
  const res = await getCategories({
    isPublic: true,
    limit: 10,
  });
  if (res.error) {
    console.error("CategoriesSection:", res.error);
  } else {
    categories = res.data ?? [];
  }
  return (
    <section className="py-14 md:py-16 container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold uppercase">
            Danh mục sách
          </h2>
          <p className="text-cool-slate mt-2">
            Khám phá những danh mục sách chính của chúng tôi.
          </p>
        </div>
        <Button
          variant="link"
          className="text-electric-indigo font-bold uppercase tracking-wider text-xs gap-2 p-0 h-auto self-start md:self-end"
        >
          Xem tất cả <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 h-[600px] sm:h-[500px]">
        {categories.map((category, index) => (
          <CategoryItem
            key={category.id}
            category={category}
            large={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
