"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { BookDetail } from "@/lib/interfaces/book";
import { BookVariant } from "@/lib/interfaces/bookVariant";
import { getBookVariants } from "@/services/bookVariants";
import { presentStatus } from "@/lib/utils/presentStatus";
import { ImageGallery } from "./ImageGallery";
import { VariantSelector } from "./VariantSelector";
import { QuantitySelector } from "./QuantitySelector";
import { FeatureHighlights } from "./FeatureHighlights";
import { ReviewSection } from "./ReviewSection";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

const priceFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

function Breadcrumb({ book }: { book: BookDetail }) {
  return (
    <nav className="mb-12 flex items-center flex-wrap gap-2 text-sm font-medium text-cool-slate">
      <Link href="/" className="hover:text-deep-charcoal transition-colors">
        Trang chủ
      </Link>
      {book.category && (
        <>
          <span className="text-cool-slate/30 select-none">/</span>
          <Link
            href={`/collections/${book.category.slug}`}
            className="hover:text-deep-charcoal transition-colors"
          >
            {book.category.name}
          </Link>
        </>
      )}
      <span className="text-cool-slate/30 select-none">/</span>
      <span className="text-deep-charcoal font-semibold truncate max-w-[200px] md:max-w-none">
        {book.name}
      </span>
    </nav>
  );
}

function BookMetadata({ book }: { book: BookDetail }) {
  return (
    <div className="grid grid-cols-2 gap-6 p-6 bg-vapor-white rounded-2xl border border-border/30">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-cool-slate">
          Nhà xuất bản
        </span>
        <span className="font-bold text-deep-charcoal">
          {book.publisher ?? "--"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-cool-slate">
          Phân phối
        </span>
        <span className="font-bold text-deep-charcoal">
          {book.distributor ?? "--"}
        </span>
      </div>
    </div>
  );
}

export function BookInform({ book }: { book: BookDetail }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [variants, setVariants] = useState<BookVariant[]>([]);
  const { addToCart } = useCart();

  const imageGallery = useMemo(
    () => [
      ...(book.image ? [book.image] : []),
      ...variants.map((v) => v.image ?? ""),
    ],
    [book.image, variants],
  );

  const selectedVariant =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  const { label: statusLabel, color: statusColor } = presentStatus(
    book.status,
    book.stock ?? 0,
  );

  useEffect(() => {
    const fetchVariants = async () => {
      const response = await getBookVariants(book.id);
      if (response.error || !response.data) {
        setVariants([]);
        return;
      }
      setVariants(response.data);
    };
    fetchVariants();
  }, [book.id]);

  const handleVariantChange = (variantId: string, imageIndex: number) => {
    setSelectedVariantId(variantId);
    setActiveImageIndex(imageIndex);
  };

  const handleAddToCart = () => {
    if (!selectedVariantId) return;
    addToCart({ id: selectedVariantId, quantity });
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`, {
      description: <p>{book.name} - {selectedVariant?.name}</p>,
      action: (
        <Button asChild>
          <Link href="/cart">
            <ShoppingCart size={18} />
          </Link>
        </Button>
      ),
    });
  };

  return (
    <main className="grow pt-24 pb-20">
      <div className="container mx-auto px-4">
        <Breadcrumb book={book} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <ImageGallery
              images={imageGallery}
              activeIndex={activeImageIndex}
              bookName={book.name}
              onImageSelect={setActiveImageIndex}
            />
          </div>

          <div className="lg:col-span-7 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-h1 tracking-tighter text-deep-charcoal mb-4 leading-[1.1]">
                {book.name}
              </h1>
              <p className="text-xl md:text-2xl text-cool-slate font-medium mb-8">
                Tác giả:{" "}
                <span className="text-deep-charcoal">{book.author}</span>
              </p>

              <div className="flex items-center gap-6 mb-10">
                <span className="text-4xl font-bold text-deep-charcoal tracking-tight">
                  {priceFormatter.format(selectedVariant?.salePrice ?? 0)}đ
                </span>
                <Badge
                  variant="outline"
                  className={`px-3 py-1 text-xs text-${statusColor}-600 border-${statusColor}-200 bg-${statusColor}-50 font-bold`}
                >
                  {statusLabel}
                </Badge>
              </div>

              <div className="space-y-8 mb-12">
                <p className="text-lg leading-relaxed text-cool-slate">
                  {book.description}
                </p>

                <VariantSelector
                  variants={variants}
                  selectedVariantId={selectedVariantId}
                  onSelect={handleVariantChange}
                />

                <BookMetadata book={book} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
                <Button
                  onClick={handleAddToCart}
                  disabled={
                    !selectedVariantId || selectedVariant?.inventory === 0
                  }
                  className="grow h-14 rounded-xl bg-deep-charcoal hover:bg-deep-charcoal/90 text-white font-bold uppercase tracking-widest text-xs gap-3"
                >
                  <ShoppingCart size={18} />
                  Thêm vào giỏ hàng
                </Button>
              </div>

              <Separator className="mb-12" />

              <FeatureHighlights />
            </motion.div>
          </div>
        </div>

        <ReviewSection />
      </div>
    </main>
  );
}
