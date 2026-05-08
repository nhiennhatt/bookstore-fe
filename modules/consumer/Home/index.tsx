import { Hero } from "./Hero";
import { CategoriesSection } from "./CategoriesSection";
import { CollectionsSection } from "./CollectionsSection";
import { FeaturedCategoriesSection } from "./FeaturedCategoriesSection";

export async function ConsumerHomePage() {
  return (
    <div className="min-h-screen bg-background font-sans text-deep-charcoal selection:bg-electric-indigo/20">
      <Hero />
      <CategoriesSection />
      <FeaturedCategoriesSection />
      <CollectionsSection />
    </div>
  );
}
